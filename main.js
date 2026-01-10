const heartsContainer = document.querySelector('.hearts-container');

const numberOfHearts = 12;

for (let i = 0; i < numberOfHearts; i++) {
    const heart = document.createElement('div');
    heart.classList.add('heart');

    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = 8 + Math.random() * 5 + 's';
    heart.style.animationDelay = Math.random() * 5 + 's';
    heart.style.transform = `scale(${0.6 + Math.random()}) rotate(45deg)`;

    heartsContainer.appendChild(heart);
}
document.addEventListener("touchend", createTapHeart);
document.addEventListener("click", createTapHeart);

function createTapHeart(e) {
    const heart = document.createElement("div");
    heart.classList.add("tap-heart");

    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;

    heart.style.left = x - 9 + "px";
    heart.style.top = y - 9 + "px";

    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 800);
}


// Elegir canción aleatoria al cargar
document.addEventListener("DOMContentLoaded", () => {
    const music = document.getElementById("bg-music");
    const musicBtn = document.querySelector(".music-btn");

    const playlist = [
        "assets/audio/song1.mp3",
        "assets/audio/song2.mp3",
        "assets/audio/song3.mp3",
        "assets/audio/song4.mp3",
        "assets/audio/song5.mp3",
        "assets/audio/song6.mp3"
    ];

    const randomSong = playlist[Math.floor(Math.random() * playlist.length)];
    music.src = randomSong;
    music.volume = 0.3;

    let isPlaying = false;

    musicBtn.addEventListener("click", async () => {
        try {
            if (!isPlaying) {
                await music.play();
                musicBtn.classList.add("playing");
                musicBtn.textContent = "⏸️";
            } else {
                music.pause();
                musicBtn.classList.remove("playing");
                musicBtn.textContent = "🎵";
            }
            isPlaying = !isPlaying;
        } catch (error) {
            console.error("Error al reproducir audio:", error);
        }
    });
});
//corazones
const {
    Engine,
    Render,
    World,
    Bodies,
    Mouse,
    MouseConstraint
} = Matter;
let mouseConstraint = null;
let engine = null;
let render = null;

const messages = [
    "Me encantas mucho",
    "Me gusta cuando me molestas",
    "Me gusta cuando te enojas",
    "Me gustan mucho tus abrazos",
    "Me gusta mucho que me beses",
    "Me gusta mucho que seas tierna de vez en cuando",
    "Me gusta darte besitos en toda tu carita",
    "Me gusta contarte mis buenisimos chistes",
    "Me gusta cuando te ríes de mis buenisimos chistes",
    "Me gusta molestarte mucho",
    "Me gusta cuando de pones a silvar de la nada",
    "Me gusta tu forma de ser conmigo",
    "Me gustas tú en general",
    "Me gusta que tengas iniciativa",
    "Me gusta cuando me haces bromas",
    "Me gusta gustarte",
    "Me gusta sentirte",
    "Me gusta quererte",
    "Me gustan tus detalles",
    "Me gusta verte",
    "Cada día te quiero conocer más y más",
    "Me gusta tu forma inquieta de ser a veces",
    "Quiero pasar contigo mucho tiempo más",
    "Me gusta escucharte hablar de las cosas que te gustan aunque no las entienda",
    "Me gusta pasar tiempo contigo",
    "Me gusta mucho tu voz",
    "Espero algún día no muy lejano tengamos un viaje corto",
    "Si lees esto quiero que sepas que me gustas mucho"

];

document.getElementById("feelingsTrigger").addEventListener("click", () => {
    const box = document.getElementById("heartsBox");
    const container = document.getElementById("physicsContainer");

    box.classList.remove("hidden");
    box.classList.add("animate-in");
    setTimeout(() => {
        box.classList.remove("animate-in");
    }, 800);

    if (engine) return; // evita reiniciar

    engine = Engine.create();

    render = Render.create({
        element: container,
        engine: engine,
        options: {
            width: container.clientWidth,
            height: container.clientHeight,
            wireframes: false,
            background: "transparent"
        }
    });

    // paredes
            const width = container.clientWidth;
        const height = container.clientHeight;

        const ground = Bodies.rectangle(width / 2, height + 20, width, 40, {
            isStatic: true
        });

        const ceiling = Bodies.rectangle(width / 2, -20, width, 40, {
            isStatic: true
        });

        const leftWall = Bodies.rectangle(-20, height / 2, 40, height, {
            isStatic: true
        });

        const rightWall = Bodies.rectangle(width + 20, height / 2, 40, height, {
            isStatic: true
        });

        World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // corazones
    messages.forEach((msg, i) => {
        const heart = Bodies.circle(150 + i * 20, 40, 18, {
            restitution: 0.9,
            render:{
                sprite: {
                    texture: "assets/img/heart.png", // imagen de corazón
                    xScale: 0.15,
                    yScale: 0.15
                }
            }
        });

        heart.message = msg;
        heart.opened = false;

        World.add(engine.world, heart);
    });

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: { stiffness: 0.2 }
    });

    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, "mousedown", event => {
        const pos = event.mouse.position;
        const bodies = Matter.Query.point(engine.world.bodies, pos);

        bodies.forEach(body => {
            if (body.message) {
                if (!body.opened) {
                    body.opened = true;
                    body.render.sprite.texture = "assets/img/heart-read.png";
                }
                showHeartModal(body.message);
            }
        });
    });

    Engine.run(engine);
    Render.run(render);
});

function showHeartModal(text) {
    const modal = document.getElementById("heartModal");
    const modalText = document.getElementById("heartModalText");

    modalText.innerText = text;
    modal.classList.remove("hidden");
}

function closeHeartModal() {
    document.getElementById("heartModal").classList.add("hidden");
}
//----
const timelineItems = document.querySelectorAll(".timeline-item");

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: 0.2
});

timelineItems.forEach(item => observer.observe(item));

function openPhoto(card) {
    const img = card.querySelector("img");
    const text = card.querySelector("span").innerText;

    document.getElementById("modalImg").src = img.src;
    document.getElementById("modalText").innerText = text;
    document.getElementById("photoModal").style.display = "flex";
}

function closePhoto() {
    document.getElementById("photoModal").style.display = "none";
}

const CORRECT_PASSWORD = "123"; // cámbiala

function unlockAlbum() {
    const input = document.getElementById("albumPassword").value;
    const album = document.getElementById("album");
    const lock = document.getElementById("albumLock");
    const message = document.getElementById("lockMessage");

    if (input === CORRECT_PASSWORD) {
        album.classList.remove("locked");
        album.classList.add("unlocked");

        message.innerText = "Bienvenida 💖";
        message.style.color = "#6B4F4F";

        setTimeout(() => {
            lock.classList.add("hide");
        }, 400);
    } else {
        message.innerText = "Esa no es la contraseña… 💭";
        message.style.color = "crimson";
        // SHAKE
    const inputField = document.getElementById("albumPassword");
    inputField.classList.remove("shake");
    void inputField.offsetWidth; // reinicia animación
    inputField.classList.add("shake");

    // VIBRACIÓN
    if (navigator.vibrate) {
        navigator.vibrate([60, 40, 60]);
    }
    }
}

const albumDays = {
    day1: {
        title: "19 de noviembre 2025 💕",
        photos: [
            "assets/photos/19nov2025-1.mp4"
        ]
    },
    day2: {
        title: "21 de noviembre 2025",
        photos: [
            "assets/photos/21nov2025-1.jpg"
        ]
    },
    day3: {
        title: "7 de diciembre 2025",
        photos: [
            "assets/photos/07122025/7dic2025-1.jpg",
            "assets/photos/07122025/7dic2025-2.jpg",
            "assets/photos/07122025/7dic2025-3.jpg",
            "assets/photos/07122025/7dic2025-4.jpg",
            "assets/photos/07122025/7dic2025-5.jpg",
            "assets/photos/07122025/7dic2025-6.jpeg"
        ]
    },
    day4: {
        title: "9 de diciembre 2025",
        photos: [
            "assets/photos/09122025/9dic2025-1.jpg",
            "assets/photos/09122025/9dic2025-2.jpg",
            "assets/photos/09122025/9dic2025-3.jpg",
            "assets/photos/09122025/9dic2025-4.jpg",
            "assets/photos/09122025/9dic2025-5.jpg",
            "assets/photos/09122025/9dic2025-6.jpg"
        ]
    }
};

function openDay(dayKey) {
    const modal = document.getElementById("dayModal");
    const title = document.getElementById("dayTitle");
    const photosContainer = document.getElementById("dayPhotos");

    title.innerText = albumDays[dayKey].title;
    photosContainer.innerHTML = "";

    albumDays[dayKey].photos.forEach(item => {
    const extension = item.split('.').pop().toLowerCase();

    if (extension === "mp4") {
        const video = document.createElement("video");
        video.src = item;
        video.controls = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.style.width = "100%";
        video.style.borderRadius = "1rem";

        photosContainer.appendChild(video);
    } else {
        const img = document.createElement("img");
        img.src = item;
        photosContainer.appendChild(img);
    }
});

    modal.style.display = "flex";
}

function closeDay() {
    document.getElementById("dayModal").style.display = "none";
}
