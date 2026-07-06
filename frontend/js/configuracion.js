function mostrarTab(id) {
    const tabs = document.querySelectorAll(".tab-content");
    const buttons = document.querySelectorAll(".tab-btn");

    tabs.forEach(tab => {
        tab.classList.remove("active");
    });

    buttons.forEach(button => {
        button.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");

    event.target.classList.add("active");
}