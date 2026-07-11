/* terminal interactions */
(function () {
    var GLYPHS = "!<>-_\\/[]{}—=+*^?#01";

    /* --- text scramble on hover (nav + any .scramble) --- */
    function scramble(el) {
        if (el.dataset.scrambling) return;
        var original = el.dataset.text || el.textContent;
        el.dataset.text = original;
        el.dataset.scrambling = "1";
        var frame = 0;
        var total = Math.max(8, original.length * 2);
        var timer = setInterval(function () {
            var out = "";
            for (var i = 0; i < original.length; i++) {
                if (i < (frame / total) * original.length) {
                    out += original[i];
                } else if (original[i] === " ") {
                    out += " ";
                } else {
                    out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                }
            }
            el.textContent = out;
            frame++;
            if (frame > total) {
                clearInterval(timer);
                el.textContent = original;
                delete el.dataset.scrambling;
            }
        }, 24);
    }

    document.querySelectorAll(".site-header nav a:not(.site-logo), .scramble").forEach(function (el) {
        el.addEventListener("mouseenter", function () { scramble(el); });
    });

    /* --- typed boot log (any element with data-boot) --- */
    var boot = document.querySelector("[data-boot]");
    if (boot) {
        var lines = JSON.parse(boot.dataset.boot);
        var li = 0, ci = 0;
        boot.textContent = "";
        (function typeLine() {
            if (li >= lines.length) {
                document.dispatchEvent(new CustomEvent("boot:done"));
                return;
            }
            var line = lines[li];
            if (ci === 0) {
                var p = document.createElement("div");
                p.className = "boot-line";
                boot.appendChild(p);
            }
            var target = boot.lastChild;
            if (ci < line.length) {
                target.innerHTML = line
                    .slice(0, ci + 1)
                    .replace(/\[ OK \]/, '<span class="ok">[ OK ]</span>')
                    .replace(/\[WARN\]/, '<span class="warn">[WARN]</span>');
                ci++;
                setTimeout(typeLine, 8);
            } else {
                li++; ci = 0;
                setTimeout(typeLine, 60);
            }
        })();
    }

    /* --- rotating typed roles (home hero) --- */
    var roleEl = document.getElementById("typed-role");
    if (roleEl) {
        var roles = JSON.parse(roleEl.dataset.roles);
        var r = 0, pos = 0, deleting = false;
        (function tick() {
            var word = roles[r];
            if (!deleting) {
                pos++;
                if (pos === word.length) {
                    deleting = true;
                    setTimeout(tick, 1800);
                    roleEl.firstChild.textContent = word.slice(0, pos);
                    return;
                }
            } else {
                pos--;
                if (pos === 0) {
                    deleting = false;
                    r = (r + 1) % roles.length;
                }
            }
            roleEl.firstChild.textContent = word.slice(0, pos);
            setTimeout(tick, deleting ? 35 : 70);
        })();
    }

    /* --- skill bars animate when visible --- */
    var fills = document.querySelectorAll(".skill-fill[data-pct]");
    if (fills.length && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.style.width = e.target.dataset.pct + "%";
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.4 });
        fills.forEach(function (f) { io.observe(f); });
    } else {
        fills.forEach(function (f) { f.style.width = f.dataset.pct + "%"; });
    }

    /* --- occasional glitch jolt on hero title --- */
    var glitchEls = document.querySelectorAll(".glitch");
    glitchEls.forEach(function (el) {
        el.addEventListener("mouseenter", function () {
            el.style.animation = "none";
            void el.offsetWidth;
            el.style.animation = "";
        });
    });
})();
