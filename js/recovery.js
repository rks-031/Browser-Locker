'use strict';

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("recovery__input");
    const sendButton = document.getElementById("recovery_btn_field");
    const message = document.getElementById("message");
    const verifyButton = document.getElementById("verify_btn_field");

    let recoveryCode = "";
    let recoveryCodeTimestamp = 0;
    const recoveryCodeExpiration = 2 * 60 * 1000; // 5 minutes in milliseconds

    sendButton.addEventListener("click", function () {
        const email = emailInput.value;

        if (email === "") {
            message.innerText = "Please enter your email address.";
            return;
        }

        recoveryCode = generateRecoveryCode();
        recoveryCodeTimestamp = Date.now();

        setTimeout(function () {
            message.innerText = `Recovery code sent to ${email}`;

            Email.send({
                // SecureToken: "9f439ae8-9c75-40b5-a4a4-a4c726e68168",
                // SecureToken: "d361d91d-7e1d-4f2d-8868-add99555cee3",
                SecureToken: "85099b63-1736-4ce9-baf8-2a547ea59f13",
                To: email,
                From: "uroy@baskethunt.in",
                Subject: "Sending Email",
                Body: `Recovery code is ${recoveryCode}`,
            }).then(function (message) {
                alert("Mail sent successfully");
            }).catch(function (error) {
                console.error("Error sending email:", error);
            });
        }, 1500);
    });

    function generateRecoveryCode() {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let recoveryCode = "";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            recoveryCode += characters.charAt(randomIndex);
        }
        return recoveryCode;
    }

    verifyButton.addEventListener("click", function () {
        const recoveryCode = prompt("Enter the recovery code:");
        if (!recoveryCode) {
            return;
        }

        setTimeout(function () {
            if (isRecoveryCodeValid() && isValidRecoveryCode(recoveryCode)) {
                message.innerText = "Code verified successfully.";
            } else {
                message.innerText = "Invalid code. Please try again.";
            }
        }, 1000);
    });

    function isValidRecoveryCode(code) {
        const validCharacters = /^[A-Z0-9]{6}$/;
        return validCharacters.test(code);
    }

    function isRecoveryCodeValid() {
        const currentTime = Date.now();
        const elapsedTime = currentTime - recoveryCodeTimestamp;
        if (elapsedTime <= recoveryCodeExpiration) {
            return true;
        } else {
            message.innerText = "Code has expired. Please request a new code.";
            return false;
        }
    }
});
