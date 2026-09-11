import os
import re

src_dir = r"c:\Users\Classic\Downloads\Magical portfolio\src"

def replace_alert(match):
    content = match.group(1)
    # Determine if it's an error or success based on the string
    lower_content = content.lower()
    if 'error' in lower_content or 'fail' in lower_content:
        return f"toast.error({content})"
    elif 'success' in lower_content:
        return f"toast.success({content})"
    else:
        # Default to a generic toast
        return f"toast({content})"

modified_files = []

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith((".js", ".jsx", ".ts", ".tsx")):
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()

            if "alert(" in content:
                # Add import if not present
                has_toast_import = "import toast" in content or "import { toast }" in content
                
                # Replace alert(...) with toast.error/success(...)
                # This regex captures the argument passed to alert
                new_content = re.sub(r'alert\((.*?)\)', replace_alert, content, flags=re.DOTALL)
                
                if new_content != content:
                    if not has_toast_import:
                        # Find the last import line or just put it at top (after 'use client' if present)
                        import_stmt = "import { toast } from 'react-hot-toast';\n"
                        if "'use client';" in new_content or '"use client";' in new_content:
                            new_content = re.sub(r'([\'"]use client[\'"];?)', r'\1\n' + import_stmt, new_content, 1)
                        else:
                            new_content = import_stmt + new_content
                            
                    with open(filepath, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    modified_files.append(filepath)

print(f"Modified {len(modified_files)} files.")
for f in modified_files:
    print(f)
