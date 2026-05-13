/**
 * NIHAO STUDY — Google Apps Script для приёма заявок с сайта
 *
 * КАК ЗАДЕПЛОИТЬ (или обновить):
 * 1. Открыть Google Sheets → Расширения → Apps Script
 * 2. Удалить старый код, вставить этот файл целиком
 * 3. Сохранить (Ctrl+S)
 * 4. Развернуть → Управление развёртываниями → нажать ✏️ на текущем
 *    → Версия: "Новая версия" → Сохранить
 *    (URL остаётся тем же — менять в main.js ничего не нужно)
 *
 * ВАЖНО: каждый раз после изменения скрипта нужно создавать
 * НОВУЮ ВЕРСИЮ через "Управление развёртываниями", иначе изменения
 * не вступят в силу.
 */

var SPREADSHEET_ID = '1U5aZ4SO_U0RUrFYSDy3QANEBdpofKvUKtDDzYP_-6a4';
var SHEET_NAME     = 'Заявки';

function getSheet_() {
  var ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата', 'Имя', 'Телефон', 'Статус', 'Пакет', 'Источник']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  return sheet;
}

/* Основной обработчик — GET с параметрами в URL */
function doGet(e) {
  try {
    var p = e.parameter || {};
    if (p.name || p.phone) {
      getSheet_().appendRow([
        new Date(),
        p.name    || '',
        p.phone   || '',
        p.status  || '',
        p.package || '',
        p.source  || 'website'
      ]);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* Запасной обработчик — POST с JSON-телом */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    getSheet_().appendRow([
      new Date(data.timestamp || new Date()),
      data.name    || '',
      data.phone   || '',
      data.status  || '',
      data.package || '',
      data.source  || 'website'
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
