// --- Timeline Navigation Setup ---
(function () {
    var rail = document.getElementById("timeline-rail");
    if (!rail) return;

    var items = rail.querySelectorAll(".timeline-item");
    var sections = [];
    items.forEach(function (item) {
        var id = item.getAttribute("data-target");
        var el = document.getElementById(id);
        if (el) sections.push({ item: item, el: el, id: id });
    });

    function setActive(activeId) {
        items.forEach(function (item) {
            if (item.getAttribute("data-target") === activeId) {
                item.classList.add("is-active");
            } else {
                item.classList.remove("is-active");
            }
        });
    }

// --- Scroll Observer ---
    var io = new IntersectionObserver(function (entries) {
        var visible = entries
            .filter(function (e) { return e.isIntersecting; })
            .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (visible.length) {
            var topId = visible[0].target.id;
            setActive(topId);
        }
    }, { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.1, 0.3, 0.5] });

    sections.forEach(function (s) { io.observe(s.el); });

// --- Global Scroll Listeners ---
    items.forEach(function (item) {
        var link = item.querySelector("a");
        if (!link) return;
        link.addEventListener("click", function (e) {
            e.preventDefault();
            var id = item.getAttribute("data-target");
            var el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });

    function showRailAfterLanding() {
        var landing = document.getElementById("landing");
        if (!landing) {
            rail.classList.add("is-visible");
            return;
        }
        var rect = landing.getBoundingClientRect();
        if (rect.bottom < window.innerHeight * 0.5) {
            rail.classList.add("is-visible");
        } else {
            rail.classList.remove("is-visible");
        }
    }
    window.addEventListener("scroll", showRailAfterLanding, { passive: true });
    showRailAfterLanding();
})();
