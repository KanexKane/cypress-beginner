# Cypress TEST with Telegram Notify and Update Google Sheet

เรียนรู้การทำ Automated Test ด้วย Cypress พร้อมทั้งมีการแจ้งเตือนผ่าน Telegram Noitfy กับ อัพเดท Status และ Date ใน Google Sheet ด้วย

ลิงก์ Playlist [เรียน Cypress ไปด้วยกัน](https://www.youtube.com/playlist?list=PLWCEDsNutP7L0i9Q2CBLlRJzkqtyA2RSP)

## วิธีใช้งาน

หลังจากดาวน์โหลดลงเครื่องแล้ว ให้ติดตั้งด้วยการพิมพ์ Terminal ก่อนการใช้งานเพื่อให้ดาวน์โหลด node_modules

```
npm install
```

## ตั้งค่า Telegram Bot

เปลี่ยน botToken กับ chatId เป็นของเรา

## ตั้งค่า Google Sheets

อัพเดทไฟล์ credentials.json และอัพเดท SHEET_ID