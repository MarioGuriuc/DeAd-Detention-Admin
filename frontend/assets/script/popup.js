let popupVisible = false;

export const openPopup = (message) => {
    const popupMessage = document.getElementById("message");

    if (popupVisible) return;

    popupMessage.innerHTML = message;

    popupMessage.classList.add("show");
    popupMessage.classList.remove("hide");

    popupVisible = true;

    setTimeout(function () {
        popupMessage.classList.add("hide");

        setTimeout(function () {
            popupVisible = false;
        }, 1000);
    }, 3000);
}
