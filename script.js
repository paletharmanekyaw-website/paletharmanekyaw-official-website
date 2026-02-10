document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    // ဘား ၃ ချောင်းကို နှိပ်လိုက်တဲ့အခါ
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Menu link တစ်ခုခုကို နှိပ်လိုက်ရင် Menu ပြန်ပိတ်သွားဖို့
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
});


// ၁။ Configurations
const scriptURL = "https://script.google.com/macros/s/AKfycbySZVHGCBwfONv6YCdTmy-vi_Sel1DfNZqROz8Ze5EC8ZAxIQeY1YEJTU2VdHatzIi8/exec"; // *** အရေးကြီးသည် ***

// ၂။ EmailJS Initialization
(function() {
    emailjs.init({ publicKey: "z5c3xqXpjlkbaC9JQ" });
})();

// ၃။ Timer Logic
document.addEventListener("DOMContentLoaded", function() {
    const startDate = new Date(2026, 0, 10, 9, 0, 0); 
    const endDate = new Date(2026, 2, 15, 23, 59, 59); 
    const now = new Date();
    const cvSection = document.getElementById('cv-section');

    if (cvSection) {
        if (now < startDate) {
            cvSection.innerHTML = `<div class="status-box"><h2>လျှောက်လွှာမကြာမီ စတင်ပါမည်</h2></div>`;
        } else if (now > endDate) {
            cvSection.innerHTML = `<div class="status-box"><h2>လျှောက်လွှာပိတ်သွားပါပြီ</h2></div>`;
        }
    }

    function updateTimer() {
        const t = endDate.getTime() - new Date().getTime();
        const timerElement = document.getElementById("timer");
        if (timerElement && t > 0) {
            const days = Math.floor(t / (1000 * 60 * 60 * 24));
            timerElement.innerHTML = `⏳ ပိတ်ရန်ကျန် - ${days} ရက်ခန့်`;
        }
    }
    setInterval(updateTimer, 60000);
    updateTimer();
    
    fetchDonors(); // Page load ချိန်တွင် အလှူရှင်စာရင်းဆွဲမည်
});

// ၄။ Fetch Donors Function
function fetchDonors() {
    const donorTable = document.getElementById('donor-data');
    if (!donorTable) return;

    fetch(scriptURL + "?action=getDonors") 
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                donorTable.innerHTML = "<tr><td colspan='4'>အလှူရှင်စာရင်း မရှိသေးပါ။</td></tr>";
                return;
            }
            data.reverse();
            let html = "";
            data.forEach(row => {
                html += `<tr>
                    <td>${row.date || '-'}</td>
                    <td>${row.name || '-'}</td>
                    <td>${row.amount || '-'}</td>
                    <td>${row.note || '-'}</td>
                </tr>`;
            });
            donorTable.innerHTML = html;
        })
        .catch(() => {
            donorTable.innerHTML = "<tr><td colspan='4'>ဒေတာဆွဲယူ၍မရပါ</td></tr>";
        });
}

// ၅။ CV Form Submit
const cvForm = document.getElementById('cv-form');
if (cvForm) {
    cvForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('cv-btn');
        btn.disabled = true;
        btn.innerHTML = "ပို့နေသည်...";

        fetch(scriptURL, { method: 'POST', body: new FormData(cvForm)})
            .then(res => res.json())
            .then(data => {
                if(data.result === 'success') {
                    Swal.fire('အောင်မြင်သည်', 'CV ကို သိမ်းဆည်းပြီးပါပြီ', 'success');
                    cvForm.reset();
                } else { throw new Error(); }
            })
            .catch(() => Swal.fire('Error', 'သိမ်းဆည်းမရပါ', 'error'))
            .finally(() => {
                btn.disabled = false;
                btn.innerHTML = "CV တင်သွင်းမည်";
            });
    });
}

// ၆။ Contact Form Submit (EmailJS)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('contact-btn');
        btn.disabled = true;
        emailjs.sendForm('service_5e0csmr', 'template_5igqggv', contactForm)
            .then(() => {
                Swal.fire('ပို့ပြီးပါပြီ', 'ကျေးဇူးတင်ပါသည်', 'success');
                contactForm.reset();
            })
            .finally(() => { btn.disabled = false; });
    });
}