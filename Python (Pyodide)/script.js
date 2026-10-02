const outputEl = document.getElementById('output')
const runBtn = document.getElementById('run')

let pyodide = null
let source = ''

function appendOutput (text) {
  outputEl.textContent += text
}

async function init () {
  source = await fetch('main.py').then(r => r.text())

  pyodide = await loadPyodide({
    stdout: (s) => appendOutput(s + '\n'),
    stderr: (s) => appendOutput(s + '\n')
  })

  runBtn.disabled = false
  runBtn.textContent = 'Run'
  await runPython()
}

async function runPython () {
  outputEl.textContent = ''
  runBtn.disabled = true
  try {
    await pyodide.runPythonAsync(source)
  } catch (err) {
    appendOutput(String(err))
  } finally {
    runBtn.disabled = false
  }
}

runBtn.addEventListener('click', runPython)
init().catch(err => appendOutput('Failed to load Pyodide: ' + err))
