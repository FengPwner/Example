// runner.js — lightweight test framework
// Exposes: describe(), it(), test(), expect(), log()
// Not meant to be edited — add tests in tests.js, solution in solution.js.

(function () {

  // ── Registry ───────────────────────────────────────────────────────────────

  var suites = [];
  var activeSuite = null;

  window.describe = function (name, fn) {
    var suite = { name: name, tests: [] };
    suites.push(suite);
    activeSuite = suite;
    fn();
    activeSuite = null;
  };

  window.it = window.test = function (name, fn) {
    if (!activeSuite) {
      activeSuite = { name: '', tests: [] };
      suites.push(activeSuite);
    }
    activeSuite.tests.push({ name: name, fn: fn });
  };

  // ── Assertions ─────────────────────────────────────────────────────────────

  function AssertionError(msg) { this.message = msg; }

  function fmt(v) {
    if (v === undefined) return 'undefined';
    return JSON.stringify(v);
  }

  function deepEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  function makeExpect(actual, negated) {
    function assert(pass, msg) {
      if (negated ? pass : !pass) throw new AssertionError(msg);
    }
    var not = negated ? '' : ' not';

    var matchers = {
      get not() { return makeExpect(actual, !negated); },

      toBe: function (expected) {
        assert(actual === expected,
          'Expected ' + fmt(actual) + not + ' to be ' + fmt(expected));
      },
      toEqual: function (expected) {
        assert(deepEqual(actual, expected),
          'Expected ' + fmt(actual) + not + ' to equal ' + fmt(expected));
      },
      toBeTruthy: function () {
        assert(!!actual, 'Expected ' + fmt(actual) + not + ' to be truthy');
      },
      toBeFalsy: function () {
        assert(!actual, 'Expected ' + fmt(actual) + not + ' to be falsy');
      },
      toBeNull: function () {
        assert(actual === null, 'Expected ' + fmt(actual) + not + ' to be null');
      },
      toBeUndefined: function () {
        assert(actual === undefined, 'Expected ' + fmt(actual) + not + ' to be undefined');
      },
      toBeGreaterThan: function (n) {
        assert(actual > n, 'Expected ' + fmt(actual) + not + ' to be > ' + n);
      },
      toBeGreaterThanOrEqual: function (n) {
        assert(actual >= n, 'Expected ' + fmt(actual) + not + ' to be >= ' + n);
      },
      toBeLessThan: function (n) {
        assert(actual < n, 'Expected ' + fmt(actual) + not + ' to be < ' + n);
      },
      toBeLessThanOrEqual: function (n) {
        assert(actual <= n, 'Expected ' + fmt(actual) + not + ' to be <= ' + n);
      },
      toContain: function (item) {
        var has = Array.isArray(actual)
          ? actual.indexOf(item) !== -1
          : String(actual).indexOf(item) !== -1;
        assert(has, 'Expected ' + fmt(actual) + not + ' to contain ' + fmt(item));
      },
      toHaveLength: function (n) {
        assert(actual != null && actual.length === n,
          'Expected length ' + (actual == null ? 'undefined' : actual.length) + not + ' to equal ' + n);
      },
      toThrow: function () {
        var threw = false;
        try { actual(); } catch (e) { threw = true; }
        assert(threw, 'Expected function' + not + ' to throw');
      },
    };

    return matchers;
  }

  window.expect = function (actual) { return makeExpect(actual, false); };

  // Captured log — use log() inside tests instead of console.log for cleaner output
  window.log = function () {
    var line = Array.prototype.slice.call(arguments)
      .map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); })
      .join(' ');
    if (window._capturedLogs) window._capturedLogs.push(line);
  };

  // ── Renderer ───────────────────────────────────────────────────────────────

  function el(tag, className, text) {
    var e = document.createElement(tag);
    if (className) e.className = className;
    if (text !== undefined) e.textContent = text;
    return e;
  }

  function escHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderTest(result) {
    var item = el('div', 'test-item ' + (result.pass ? 'pass' : 'fail'));

    var header = el('div', 'test-header');
    header.appendChild(el('span', 'test-icon', result.pass ? '✓' : '✗'));
    header.appendChild(el('span', 'test-name', result.name));
    header.appendChild(el('span', 'test-time', result.ms.toFixed(1) + 'ms'));
    item.appendChild(header);

    if (!result.pass && result.error) {
      var errEl = el('div', 'test-error', result.error);
      item.appendChild(errEl);
    }

    if (result.logs.length > 0) {
      var logsEl = el('div', 'test-logs');
      result.logs.forEach(function (line) {
        logsEl.appendChild(el('div', 'log-line', line));
      });
      item.appendChild(logsEl);
    }

    return item;
  }

  // ── Runner ─────────────────────────────────────────────────────────────────

  async function run() {
    var btn       = document.getElementById('run-btn');
    var resultsEl = document.getElementById('results');
    var summaryEl = document.getElementById('summary');
    var bar       = document.getElementById('progress-bar');
    var barText   = document.getElementById('progress-text');

    btn.disabled = true;
    btn.textContent = 'Running…';
    resultsEl.innerHTML = '';
    summaryEl.className = 'hidden';
    bar.style.width = '0%';
    bar.className = 'progress-bar';
    barText.textContent = '';

    var total = 0;
    suites.forEach(function (s) { total += s.tests.length; });

    var done = 0, passed = 0;

    for (var si = 0; si < suites.length; si++) {
      var suite = suites[si];

      if (suite.name) {
        resultsEl.appendChild(el('div', 'suite-label', suite.name));
      }

      for (var ti = 0; ti < suite.tests.length; ti++) {
        var t = suite.tests[ti];
        var logs = [];

        // Intercept console.log for the duration of this test
        var origLog = console.log;
        window._capturedLogs = logs;
        console.log = function () {
          var line = Array.prototype.slice.call(arguments)
            .map(function (a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); })
            .join(' ');
          logs.push(line);
          origLog.apply(console, arguments);
        };

        var err = null;
        var t0 = performance.now();
        try { t.fn(); } catch (e) { err = e; }
        var ms = performance.now() - t0;

        console.log = origLog;
        window._capturedLogs = null;

        done++;
        var pass = !err;
        if (pass) passed++;

        resultsEl.appendChild(renderTest({
          pass: pass,
          name: t.name,
          ms: ms,
          error: err ? (err.message || String(err)) : null,
          logs: logs
        }));

        var pct = (done / total) * 100;
        bar.style.width = pct + '%';
        bar.className   = 'progress-bar' + (passed < done ? ' failing' : '');
        barText.textContent = passed + ' / ' + total + ' passed';

        // Yield to let the browser paint between tests
        await new Promise(function (r) { setTimeout(r, 16); });
      }
    }

    // Summary
    var allPass = passed === total;
    summaryEl.className = 'summary ' + (allPass ? 'all-pass' : 'has-fail');
    summaryEl.innerHTML =
      '<span class="summary-icon">' + (allPass ? '✓' : '✗') + '</span>' +
      '<span>' + passed + ' / ' + total + ' tests passed</span>' +
      '<span class="summary-detail">' + Math.round(passed / total * 100) + '% pass rate</span>';

    btn.disabled = false;
    btn.textContent = '▶ Run Tests';
  }

  document.getElementById('run-btn').addEventListener('click', run);

})();
