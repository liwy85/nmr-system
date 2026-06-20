/**
 * NMR 核磁测试登记表 — 后端服务器
 * 提供 REST API + 静态文件服务，数据以 JSON 文件持久化存储
 *
 * API 接口：
 *   GET    /api/rows           获取全部记录
 *   POST   /api/rows/batch     批量覆盖保存全部记录
 *   DELETE /api/rows/:id       删除单条记录
 *   GET    /api/health         健康检查
 */

var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();
var PORT = process.env.PORT || 3000;

// 数据文件路径
var DATA_FILE = path.join(__dirname, 'data.json');

// 中间件
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== 数据存储层 =====

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      var raw = fs.readFileSync(DATA_FILE, 'utf-8');
      var data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (e) {
    console.error('[存储] 读取数据失败:', e.message);
  }
  return [];
}

function saveData(rows) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('[存储] 保存数据失败:', e.message);
    return false;
  }
}

// ===== API 路由 =====

// 健康检查
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', count: loadData().length, time: new Date().toISOString() });
});

// 获取全部记录
app.get('/api/rows', function(req, res) {
  var rows = loadData();
  res.json(rows);
});

// 批量覆盖保存（前端每次修改后发送全量数据）
app.post('/api/rows/batch', function(req, res) {
  var rows = req.body;
  if (!Array.isArray(rows)) {
    return res.status(400).json({ error: '请求体必须是数组' });
  }
  // 基本校验：每条记录必须有 id
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i] || !rows[i].id) {
      return res.status(400).json({ error: '第 ' + (i + 1) + ' 条记录缺少 id' });
    }
  }
  var ok = saveData(rows);
  if (ok) {
    res.json({ success: true, count: rows.length });
  } else {
    res.status(500).json({ error: '保存失败' });
  }
});

// 删除单条记录
app.delete('/api/rows/:id', function(req, res) {
  var id = req.params.id;
  var rows = loadData();
  var before = rows.length;
  rows = rows.filter(function(r) { return r.id !== id; });
  if (rows.length === before) {
    return res.status(404).json({ error: '未找到 id=' + id + ' 的记录' });
  }
  saveData(rows);
  res.json({ success: true, count: rows.length });
});

// ===== 静态文件服务 =====
app.use(express.static(path.join(__dirname, 'public')));

// 显式首页路由（确保始终返回 index.html）
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// SPA 回退：所有非 API、非静态文件请求返回 index.html
app.get('*', function(req, res) {
  if (req.path.indexOf('/api/') === 0) {
    return res.status(404).json({ error: '接口不存在' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, function() {
  console.log('========================================');
  console.log('  NMR 核磁测试登记表系统已启动');
  console.log('  访问地址: http://localhost:' + PORT);
  console.log('  API 健康: http://localhost:' + PORT + '/api/health');
  console.log('  数据文件: ' + DATA_FILE);
  console.log('========================================');
});
