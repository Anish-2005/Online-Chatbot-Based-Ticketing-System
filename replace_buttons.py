import os
import re

search_dir = r"c:\Users\ANISH\Documents\PROJECTS\Online-Chatbot-Based-Ticketing-System\Frontend\src"

pattern1 = re.compile(r'''\s*<[A-Za-z\.]*button[^>]*onClick=\{toggleTheme\}[^>]*>\s*\{?isDark\s*\?\s*['"]☀️ Light Mode['"]\s*:\s*['"]🌙 Dark Mode['"]\}?\s*</[A-Za-z\.]*button>\s*''', re.DOTALL | re.IGNORECASE)

pattern2 = re.compile(r'''\s*<button[^>]*onClick=\{toggleTheme\}[^>]*>\s*(?:\{isDark \? <FiSun[^>]*/> : <FiMoon[^>]*/>\})\s*\{!isCollapsed && <span>\{isDark \? 'Light Mode' : 'Dark Mode'\}</span>\}\s*</button>\s*''', re.DOTALL | re.IGNORECASE)

# Sidebar specific
pattern_sidebar = re.compile(r'''\s*<button\s*type="button"\s*onClick=\{\(event\)\s*=>\s*toggleTheme\(event\)\}[^>]*>\s*\{isDark \? <FiSun[^>]*/> : <FiMoon[^>]*/>\}\s*\{!isCollapsed && <span>\{isDark \? 'Light Mode' : 'Dark Mode'\}</span>\}\s*</button>\s*''', re.DOTALL | re.IGNORECASE)

import_statement_components = "import ThemeToggleButton from './ThemeToggleButton';\n"
import_statement_pages = "import ThemeToggleButton from '../components/ThemeToggleButton';\n"
import_statement_root = "import ThemeToggleButton from './components/ThemeToggleButton';\n"

for root, dirs, files in os.walk(search_dir):
    for file in files:
        if not file.endswith('.js') and not file.endswith('.jsx'):
            continue
        filepath = os.path.join(root, file)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Determine import path based on relative position
        rel_path = os.path.relpath(filepath, search_dir)
        import_stmt = import_statement_pages if '\\pages\\' in filepath else import_statement_components
        if rel_path == file: # Root
            import_stmt = import_statement_root

        # Check for standard '🌙 Dark Mode' button
        if re.search(pattern1, new_content):
            new_content = re.sub(pattern1, '\n            <ThemeToggleButton />\n', new_content)
        
        # Check for sidebar button
        if re.search(pattern_sidebar, new_content):
            new_content = re.sub(pattern_sidebar, '\n        <ThemeToggleButton isCollapsed={isCollapsed} />\n', new_content)

        if new_content != content:
            # Add import
            import_regex = re.compile(r"import React[^;]*;\n")
            if 'ThemeToggleButton' not in new_content:
                if re.search(import_regex, new_content):
                    new_content = re.sub(import_regex, "\\g<0>" + import_stmt, new_content, count=1)
                else:
                    new_content = import_stmt + new_content
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {rel_path}")
