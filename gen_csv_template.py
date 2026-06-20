# -*- coding: utf-8 -*-
"""
生成 NMR 核磁测试登记表 — CSV批量导入模板
输出：public/NMR批量导入模板.csv（UTF-8 BOM，兼容Excel直接打开）
"""

COLUMNS = [
    "登记日期", "样品编号", "送样人", "单位/部门", "样品状态",
    "保存条件", "溶剂/氘代试剂", "测试项目", "优先级", "状态",
    "付款状态", "备注"
]

EXAMPLES = [
    ["2026-06-20", "WK-001", "李俊凯", "长江大学", "固体", "室温",
     "氘代氯仿(CDCl₃)", "1H谱(16ns),13C谱(512ns)", "正常", "已测试", "未付款", "常规样品"],
    ["2026-06-20", "WK-002", "徐志红", "辽宁科技学院", "液体", "冷藏",
     "氘代二甲亚砜(DMSO-d₆)", "1H谱(16ns)", "加急", "测试中", "未付款", "加急处理[+10元]"],
    ["2026-06-21", "WK-003", "姜春风", "长江大学", "溶解液体", "室温",
     "重水(D₂O)", "COSY (64ns),HSQC (512ns)", "正常", "待测试", "已付款", "二维谱测试"],
]

def csv_escape(val):
    """CSV字段转义：含逗号、引号、换行时用双引号包裹"""
    s = str(val)
    if ',' in s or '"' in s or '\n' in s:
        s = '"' + s.replace('"', '""') + '"'
    return s

lines = []
# 表头
lines.append(','.join(csv_escape(c) for c in COLUMNS))
# 示例数据
for row in EXAMPLES:
    lines.append(','.join(csv_escape(c) for c in row))
# 空行（方便填写）
for i in range(4, 11):
    lines.append(','.join('' for _ in COLUMNS))

content = '\r\n'.join(lines) + '\r\n'

# UTF-8 BOM 编码（Excel直接打开不乱码）
output = "public/NMR批量导入模板.csv"
with open(output, 'w', encoding='utf-8-sig', newline='') as f:
    f.write(content)

print(f"✅ CSV模板已生成: {output}")
print(f"   编码: UTF-8 BOM（Excel兼容）")
print(f"   列数: {len(COLUMNS)} 列")
print(f"   含 {len(EXAMPLES)} 行示例数据")
