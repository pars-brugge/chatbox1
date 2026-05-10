const WEBHOOK_URL = "https://n8n.srv1117365.hstgr.cloud/webhook/54060dba-c8e1-4b78-8e41-23b57ff40cc4/chat";

async function handleSend() {
    const input = document.getElementById('user-input');
    const text = input.value;
    if (!text) return;

    // ۱. نمایش پیام کاربر در صفحه
    addMessage('user', text);
    input.value = '';

    try {
        // ۲. ارسال درخواست به n8n
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatInput: text, // فیلدی که n8n انتظار دارد
                userId: "user_123" // اختیاری برای شناسایی کاربر
            })
        });

        if (!response.ok) throw new Error("خطا در ارتباط با n8n");

        // ۳. دریافت پاسخ از n8n
        // توجه: فرمت پاسخ بستگی به تنظیمات n8n شما دارد (معمولاً یک متن ساده یا JSON)
        const data = await response.json();
        
        // فرض می‌کنیم n8n فیلدی به نام output یا response برمی‌گرداند
        const botReply = data.output || data.response || JSON.stringify(data);
        
        addMessage('bot', botReply);

    } catch (error) {
        console.error("Error:", error);
        addMessage('bot', "متأسفانه مشکلی در اتصال به سرور n8n پیش آمد.");
    }
}

function addMessage(role, text) {
    const win = document.getElementById('chat-window');
    const div = document.createElement('div');
    div.className = `msg ${role}`;
    // استفاده از کتابخانه marked برای تبدیل جداول و Markdown به HTML
    div.innerHTML = role === 'bot' ? marked.parse(text) : text;
    win.appendChild(div);
    win.scrollTop = win.scrollHeight;
}