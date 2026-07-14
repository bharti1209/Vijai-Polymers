 document.addEventListener("DOMContentLoaded", function () {
            const revealElements = document.querySelectorAll(".reveal, .reveal-zoom");
            const observerOptions = { threshold: 0.15, rootMargin: "0px 0px -60px 0px" };

            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("in-view");
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            revealElements.forEach(element => { revealObserver.observe(element); });

            // Mobile menu controls
            const menuToggleBtn = document.getElementById('menuToggleBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            const menuIcon = document.getElementById('menuIcon');

            menuToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isHidden = mobileMenu.classList.contains('hidden');
                if (isHidden) {
                    mobileMenu.classList.remove('hidden');
                    menuIcon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
                    document.body.style.overflow = 'hidden';
                } else {
                    closeMobileMenu();
                }
            });

            function closeMobileMenu() {
                mobileMenu.classList.add('hidden');
                menuIcon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
                document.body.style.overflow = '';
            }

            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) closeMobileMenu();
            });

            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => closeMobileMenu());
            });
        });

        // Modal Functionality
        function openModal(title) {
            const modal = document.getElementById('caseStudyModal');
            document.getElementById('modalTitle').innerText = title;
            modal.classList.remove('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.remove('scale-95');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('caseStudyModal');
            modal.classList.add('opacity-0', 'pointer-events-none');
            modal.querySelector('div').classList.add('scale-95');
            document.body.style.overflow = '';
        }

        // Replace this URL with your latest deployment URL
        const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxR9FZ-xkspzAza3-QcEos109x_doP6CE9hSexG7MMw0mf6o0zKqUnvAAf0W5066Zh8A/exec";

        document.getElementById("inquiryForm").addEventListener("submit", function (e) {
            e.preventDefault();

            // 1. Collect data
            const formData = new URLSearchParams();
            formData.append("Name", document.getElementById("formName").value);
            formData.append("Phone", document.getElementById("formPhone").value);
            formData.append("Email", document.getElementById("formEmail").value);
            formData.append("Message", document.getElementById("formMessage").value);

            // 2. Send to Google Sheet
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        alert("Success! Your inquiry has been submitted successfully.");
                        document.getElementById("inquiryForm").reset();
                    } else {
                        throw new Error(data.error || "Unknown error");
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("There is an error saving your inquiry: " + error.message);
                });
        });