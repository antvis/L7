#!/bin/bash

# 设置目标目录
target_directory="website/examples"

# 设置合并后的文件名
merged_file="merged_demo_code.txt"

# 删除已存在的合并文件
rm -f "$merged_file"

# 遍历目标目录下的所有.md文件
find "$target_directory" -type f \( -name "*.ts" -o -name "*.js" \) -print0 | while IFS= read -r -d $'\0' file; do
    # 输出当前处理的文件名
    echo "Merging $file"

    # 使用cat命令将文件内容追加到合并文件中
    cat "$file" >> "$merged_file"
done

echo "Merge complete. Merged file: $merged_file"
