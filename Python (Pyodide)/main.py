import sys
import math

print(f"Python {sys.version.split()[0]} running in your browser")
print("-" * 40)

# A few things to play with:
for n in range(1, 6):
    print(f"{n}! = {math.factorial(n)}")

print()
print("Primes under 30:")
print([n for n in range(2, 30) if all(n % d for d in range(2, int(math.sqrt(n)) + 1))])
