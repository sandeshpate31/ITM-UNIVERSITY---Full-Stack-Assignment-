
/* =========================================
   GET ELEMENTS
========================================= */

const form = document.getElementById("studentForm");
const submitBtn = document.getElementById("submitBtn");
const buttonText = document.getElementById("buttonText");
const loader = document.getElementById("loader");

const successModal = document.getElementById("successModal");
const okayBtn = document.getElementById("okayBtn");
const popupStudentName = document.getElementById("popupStudentName");

const waitScreen = document.getElementById("waitScreen");
const countdownElement = document.getElementById("countdown");
const waitProgressBar = document.getElementById("waitProgressBar");
const waitStatus = document.getElementById("waitStatus");

let pendingStudent = null;
let countdownTimer = null;
let remainingSeconds = 10;
let isProcessing = false;

const fieldRules = [
    {
        id: "studentName",
        errorId: "nameError",
        validate(value) {
            if (!value) return "Please enter student name.";
            if (value.length < 3) return "Name must contain at least 3 characters.";
            if (!/^[\p{L}\p{M} .'-]+$/u.test(value)) {
                return "Please enter a valid name.";
            }
            return "";
        }
    },
    {
        id: "email",
        errorId: "emailError",
        validate(value) {
            if (!value) return "Please enter email address.";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                return "Please enter a valid email address.";
            }
            return "";
        }
    },
    {
        id: "phone",
        errorId: "phoneError",
        validate(value) {
            if (!value) return "Please enter phone number.";
            if (!/^[6-9]\d{9}$/.test(value)) {
                return "Enter a valid 10-digit Indian mobile number.";
            }
            return "";
        }
    },
    {
        id: "course",
        errorId: "courseError",
        validate(value) {
            return value ? "" : "Please select a course.";
        }
    }
];

const marksFields = [
    { id: "htmlMarks", name: "HTML" },
    { id: "cssMarks", name: "CSS" },
    { id: "jsMarks", name: "JavaScript" },
    { id: "reactMarks", name: "React JS" }
];

/* =========================================
   VALIDATION HELPERS
========================================= */

function showError(errorId, message) {
    document.getElementById(errorId).textContent = message;
}

function validateField(rule) {
    const input = document.getElementById(rule.id);
    const error = rule.validate(input.value.trim());

    showError(rule.errorId, error);

    input.classList.toggle("invalid", Boolean(error));
    input.classList.toggle("valid", !error && Boolean(input.value.trim()));

    input.setAttribute("aria-invalid", String(Boolean(error)));

    return !error;
}

function validateMarks(field) {
    const input = document.getElementById(field.id);
    const errorElement = document.getElementById(field.id + "Error");
    const card = input.closest(".mark-card");
    const rawValue = input.value.trim();

    let message = "";

    if (rawValue === "") {
        message = `Please enter ${field.name} marks.`;
    } else if (
        !/^\d+$/.test(rawValue) ||
        Number(rawValue) < 0 ||
        Number(rawValue) > 100
    ) {
        message = "Enter a whole number between 0 and 100.";
    }

    errorElement.textContent = message;
    input.classList.toggle("invalid", Boolean(message));
    input.classList.toggle("valid", !message);
    input.setAttribute("aria-invalid", String(Boolean(message)));

    card.classList.toggle("has-error", Boolean(message));

    return !message;
}

function clearErrors() {
    document.querySelectorAll(".error").forEach(element => {
        element.textContent = "";
    });

    document.getElementById("marksError").textContent = "";

    document.querySelectorAll("input, select").forEach(input => {
        input.classList.remove("invalid", "valid");
        input.removeAttribute("aria-invalid");
    });

    document.querySelectorAll(".mark-card").forEach(card => {
        card.classList.remove("has-error");
    });
}

/* =========================================
   LIVE VALIDATION
========================================= */

fieldRules.forEach(rule => {
    const input = document.getElementById(rule.id);

    input.addEventListener("blur", () => {
        validateField(rule);
    });

    input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
            validateField(rule);
        }
    });

    input.addEventListener("change", () => {
        if (input.value.trim()) validateField(rule);
    });
});

// Phone: allow only digits
document.getElementById("phone").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

// Marks: prevent invalid typing beyond 100
marksFields.forEach(field => {
    const input = document.getElementById(field.id);

    input.addEventListener("input", () => {
        if (input.value !== "" && Number(input.value) > 100) {
            input.value = "100";
        }

        if (input.classList.contains("invalid")) {
            validateMarks(field);
        }
    });

    input.addEventListener("blur", () => {
        if (input.value !== "") validateMarks(field);
    });
});

/* =========================================
   FORM SUBMIT
========================================= */

form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isProcessing) return;

    clearErrors();

    let isValid = true;
    let firstInvalid = null;

    // Validate personal details
    fieldRules.forEach(rule => {
        if (!validateField(rule)) {
            isValid = false;

            if (!firstInvalid) {
                firstInvalid = document.getElementById(rule.id);
            }
        }
    });

    // Validate all marks
    marksFields.forEach(field => {
        if (!validateMarks(field)) {
            isValid = false;

            if (!firstInvalid) {
                firstInvalid = document.getElementById(field.id);
            }
        }
    });

    if (!isValid) {
        if (firstInvalid) {
            firstInvalid.focus();
            firstInvalid.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        const marksInvalid = marksFields.some(field => {
            return Boolean(
                document.getElementById(field.id + "Error").textContent
            );
        });

        document.getElementById("marksError").textContent =
            marksInvalid
                ? "Please correct the highlighted marks fields."
                : "";

        return;
    }

    const name = document.getElementById("studentName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const course = document.getElementById("course").value;

    const marks = {};

    marksFields.forEach(field => {
        marks[field.name.replace(" ", "")] =
            Number(document.getElementById(field.id).value);
    });

    const values = Object.values(marks);
    const total = values.reduce((sum, value) => sum + value, 0);
    const percentage = total / values.length;

    let grade;

    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";
    else grade = "F";

    const passed = values.every(mark => mark >= 40);

    pendingStudent = {
        studentName: name,
        email,
        phone,
        course,
        marks,
        totalMarks: total,
        maximumMarks: 400,
        percentage: Number(percentage.toFixed(2)),
        grade,
        result: passed ? "PASS" : "FAIL",
        submittedAt: new Date().toLocaleString()
    };

    // Show the submit loading animation briefly
    isProcessing = true;
    submitBtn.disabled = true;
    buttonText.textContent = "Registration Successful";
    loader.style.display = "inline-block";

    setTimeout(() => {
        loader.style.display = "none";
        buttonText.textContent = "Submit Registration";
        submitBtn.disabled = false;
        isProcessing = false;

        popupStudentName.textContent = pendingStudent.studentName;

        successModal.classList.add("show");
        successModal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        okayBtn.focus();
    }, 500);
});

/* =========================================
   OKAY BUTTON
   Start the 60-second countdown
========================================= */

okayBtn.addEventListener("click", function () {
    if (!pendingStudent || isProcessing) return;

    // Save student data before leaving this page
    try {
        localStorage.setItem(
            "itmStudent",
            JSON.stringify(pendingStudent)
        );
    } catch (error) {
        alert("Unable to save student data. Please enable browser storage.");
        return;
    }

    successModal.classList.remove("show");
    successModal.setAttribute("aria-hidden", "true");

    waitScreen.classList.add("show");
    waitScreen.setAttribute("aria-hidden", "false");

     remainingSeconds = 10;
    updateCountdown();

    // Update countdown once every second
    countdownTimer = setInterval(() => {
        remainingSeconds--;
        updateCountdown();

        if (remainingSeconds <= 0) {
            clearInterval(countdownTimer);
            countdownTimer = null;

            // Navigate only after the full 60 seconds
            window.location.href = "result.html";
        }
    }, 1000);
});

function updateCountdown() {
    countdownElement.textContent = remainingSeconds;

    const progress = ((10 - remainingSeconds) / 10) * 100;
    waitProgressBar.style.width = progress + "%";

    if (remainingSeconds > 7) {
        waitStatus.textContent = "Verifying registration details...";
    } else if (remainingSeconds > 4) {
        waitStatus.textContent = "Calculating academic performance...";
    } else if (remainingSeconds > 0) {
        waitStatus.textContent = "Preparing your final result...";
    } else {
        waitStatus.textContent = "Opening your result...";
    }
}