// =========================================================================
// 【Google Apps Script (GAS) 専用コード】
// 
// このファイルの内容をすべてコピーし、Googleスプレッドシートの
// 「拡張機能」 > 「Apps Script」のエディタ画面に貼り付けて保存してください。
// =========================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // スプレッドシートの末尾行にデータを追加
    sheet.appendRow([
      data.timestamp,
      data.attendance,
      data.name,
      data.kana,
      data.companion,
      data.allergy,
      data.message
    ]);
    
    // CORSエラー回避のためのレスポンス
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*");
  }
}

// プリフライト（CORS予備通信）に対応する doOptions 関数
function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "*")
    .setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// GET接続用のフォールバック doGet 関数（CORSリダイレクト等でのエラーを防ぎます）
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "GAS Web App is active." }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}
