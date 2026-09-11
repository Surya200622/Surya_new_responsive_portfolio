import os
import re

src_dir = r"c:\Users\Classic\Downloads\Magical portfolio\src"

modified_files = []

def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    def repl_set_success(m):
        inner = m.group(1).strip()
        if inner == "''" or inner == '""' or inner == 'null':
            return ""
        return f"toast.success({inner});"

    # Match setSuccess(...)
    content = re.sub(r'setSuccess\((.*?)\);?', repl_set_success, content)

    if content != original_content:
        # Add import if needed
        has_toast_import = "import toast" in content or "import { toast }" in content
        if not has_toast_import:
            import_stmt = "import { toast } from 'react-hot-toast';\n"
            if "'use client';" in content or '"use client";' in content:
                content = re.sub(r'([\'"]use client[\'"];?)', r'\1\n' + import_stmt, content, 1)
            else:
                content = import_stmt + content
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        modified_files.append(filepath)

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".js", ".jsx", ".ts", ".tsx")):
            filepath = os.path.join(root, file)
            process_file(filepath)

print(f"Modified {len(modified_files)} files.")
