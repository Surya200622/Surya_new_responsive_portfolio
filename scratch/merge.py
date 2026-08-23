import re
import json

with open("src/data/calculatorData.js", "r", encoding="utf-8") as f:
    content = f.read()

packages_match = re.search(r"export const PACKAGES = (\{.*?\});\n\nexport const PACKAGE_PRICES", content, re.DOTALL)
prices_match = re.search(r"export const PACKAGE_PRICES = (\{.*?\});\n\nexport const CREATIVE_SERVICE_PRICES", content, re.DOTALL)

packages_str = packages_match.group(1)
prices_str = prices_match.group(1)

# Hacky way to parse JS objects:
import ast
def js_to_py(js_str):
    # This might be tricky because JS keys are unquoted sometimes.
    pass

# Better approach: since we are in JS environment, let's use node directly.
