const storage = (table) => {
  if (!localStorage.getItem(table)) {
    localStorage.setItem(table, JSON.stringify({}));
  }

  const get = (key = null) => {
    let data = JSON.parse(localStorage.getItem(table));
    return key ? data[key] : data;
  };

  const set = (key, value) => {
    let storage = get();
    storage[key] = value;
    localStorage.setItem(table, JSON.stringify(storage));
  };

  const unset = (key) => {
    let storage = get();
    delete storage[key];
    localStorage.setItem(table, JSON.stringify(storage));
  };

  const has = (key) => Object.keys(get()).includes(key);

  return {
    get,
    set,
    unset,
    has,
  };
};

const request = (method, path) => {
  let storedData = localStorage.getItem("commentData"); // Ganti dengan kunci lokal storage yang sesuai
  let data = JSON.parse(storedData) || {}; // Menggunakan objek kosong jika tidak ada data

  return {
    async then(...params) {
      return new Promise((resolve) => {
        resolve(data);
      }).then(...params);
    },
    token(token) {
      // Fungsi token masih bisa digunakan untuk mengatur token jika diperlukan
      return this;
    },
    body(body) {
      data = body; // Menyimpan data ke localStorage
      localStorage.setItem("commentData", JSON.stringify(body)); // Ganti dengan kunci lokal storage yang sesuai
      return this;
    },
  };
};

const util = (() => {
  const opacity = (nama) => {
    let nm = document.getElementById(nama);
    let op = parseInt(nm.style.opacity);
    let clear = null;

    clear = setInterval(() => {
      if (op >= 0) {
        nm.style.opacity = op.toString();
        op -= 0.025;
      } else {
        clearInterval(clear);
        clear = null;
        nm.remove();
        return;
      }
    }, 10);
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const salin = (btn, msg = "Tersalin", timeout = 1500) => {
    navigator.clipboard.writeText(btn.getAttribute("data-nomer"));

    let tmp = btn.innerHTML;
    btn.innerHTML = msg;
    btn.disabled = true;

    let clear = null;
    clear = setTimeout(() => {
      btn.innerHTML = tmp;
      btn.disabled = false;
      btn.focus();

      clearTimeout(clear);
      clear = null;
      return;
    }, timeout);
  };

  const timer = () => {
    let countDownDate = new Date(
      document
        .getElementById("tampilan-waktu")
        .getAttribute("data-waktu")
        .replace(" ", "T")
    ).getTime();

    setInterval(() => {
      let distance = Math.abs(countDownDate - new Date().getTime());

      document.getElementById("hari").innerText = Math.floor(
        distance / (1000 * 60 * 60 * 24)
      );
      document.getElementById("jam").innerText = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      document.getElementById("menit").innerText = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60)
      );
      document.getElementById("detik").innerText = Math.floor(
        (distance % (1000 * 60)) / 1000
      );
    }, 1000);
  };

  const music = (btn) => {
    if (btn.getAttribute("data-status") !== "true") {
      btn.setAttribute("data-status", "true");
      audio.play();
      btn.innerHTML = '<i class="fa-solid fa-circle-pause spin-button"></i>';
    } else {
      btn.setAttribute("data-status", "false");
      audio.pause();
      btn.innerHTML = '<i class="fa-solid fa-circle-play"></i>';
    }
  };

  const modal = (img) => {
    document.getElementById("show-modal-image").src = img.src;
    new bootstrap.Modal("#modal-image").show();
  };

  const tamu = () => {
    let name = new URLSearchParams(window.location.search).get("to");

    if (!name) {
      document.getElementById("nama-tamu").remove();
      return;
    }

    let div = document.createElement("div");
    div.classList.add("m-2");
    div.innerHTML = `<p class="mt-0 mb-1 mx-0 p-0 text-dark">Kepada Yth Bapak/Ibu/Saudara/i</p><h2 class="text-dark">${escapeHtml(
      name
    )}</h2>`;

    document.getElementById("form-nama").value = name;
    document.getElementById("nama-tamu").appendChild(div);
  };

  const animation = async () => {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    let skew = 1;

    let randomInRange = (min, max) => {
      return Math.random() * (max - min) + min;
    };

    (async function frame() {
      const timeLeft = animationEnd - Date.now();
      const ticks = Math.max(200, 500 * (timeLeft / duration));

      skew = Math.max(0.8, skew - 0.001);

      await confetti({
        particleCount: 1,
        startVelocity: 0,
        ticks: ticks,
        origin: {
          x: Math.random(),
          y: Math.random() * skew - 0.2,
        },
        colors: ["FFC0CB", "FF69B4", "FF1493", "C71585"],
        shapes: ["heart"],
        gravity: randomInRange(0.5, 1),
        scalar: randomInRange(1, 2),
        drift: randomInRange(-0.5, 0.5),
      });

      if (timeLeft > 0) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const buka = async (button) => {
    button.disabled = true;
    document.querySelector("body").style.overflowY = "scroll";
    AOS.init();
    audio.play();

    if (localStorage.getItem("alertClosed")) {
      document.getElementById("alertDiv").style.display = "none";
    }

    opacity("welcome");
    document.getElementById("tombol-musik").style.display = "block";
    timer();

    await confetti({
      origin: { y: 0.8 },
      zIndex: 1057,
    });
    await session.check();
    await animation();
  };

  const show = () => {
    tamu();
    opacity("loading");
    window.scrollTo(0, 0);
  };

  return {
    buka,
    tamu,
    modal,
    music,
    salin,
    escapeHtml,
    opacity,
    show,
  };
})();

const progress = (() => {
  const assets = document.querySelectorAll("img");
  const info = document.getElementById("progress-info");
  const bar = document.getElementById("bar");

  let total = assets.length;
  let loaded = 0;

  const progress = () => {
    loaded += 1;

    bar.style.width = Math.min((loaded / total) * 100, 100).toString() + "%";
    info.innerText = `Loading assets (${loaded}/${total}) [${parseInt(
      bar.style.width
    ).toFixed(0)}%]`;

    if (loaded == total) {
      util.show();
    }
  };

  assets.forEach((asset) => {
    if (asset.complete && asset.naturalWidth !== 0) {
      progress();
    } else {
      asset.addEventListener("load", () => progress());
    }
  });
})();

const audio = (() => {
  let audio = null;

  const singleton = () => {
    if (!audio) {
      audio = new Audio();
      audio.src = document
        .getElementById("tombol-musik")
        .getAttribute("data-url");
      audio.load();
      audio.currentTime = 0;
      audio.autoplay = true;
      audio.muted = false;
      audio.loop = true;
      audio.volume = 1;
    }

    return audio;
  };

  return {
    play: () => singleton().play(),
    pause: () => singleton().pause(),
  };
})();

const pagination = (() => {
  const perPage = 10;
  let pageNow = 0;
  let resultData = 0;

  const page = document.getElementById("page");
  const prev = document.getElementById("previous");
  const next = document.getElementById("next");

  const disabledPrevious = () => {
    prev.classList.add("disabled");
  };

  const disabledNext = () => {
    next.classList.add("disabled");
  };

  const buttonAction = async (button) => {
    let tmp = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner-border spinner-border-sm me-1"></span>Loading...`;
    await comment.ucapan();
    document
      .getElementById("daftar-ucapan")
      .scrollIntoView({ behavior: "smooth" });
    button.disabled = false;
    button.innerHTML = tmp;
  };

  return {
    getPer: () => {
      return perPage;
    },
    getNext: () => {
      return pageNow;
    },
    reset: async () => {
      pageNow = 0;
      resultData = 0;
      page.innerText = 1;
      next.classList.remove("disabled");
      await comment.ucapan();
      disabledPrevious();
    },
    setResultData: (len) => {
      resultData = len;
      if (resultData < perPage) {
        disabledNext();
      }
    },
    previous: async (button) => {
      if (pageNow < 0) {
        disabledPrevious();
      } else {
        pageNow -= perPage;
        disabledNext();
        await buttonAction(button);
        page.innerText = parseInt(page.innerText) - 1;
        next.classList.remove("disabled");
        if (pageNow <= 0) {
          disabledPrevious();
        }
      }
    },
    next: async (button) => {
      if (resultData < perPage) {
        disabledNext();
      } else {
        pageNow += perPage;
        disabledPrevious();
        await buttonAction(button);
        page.innerText = parseInt(page.innerText) + 1;
        prev.classList.remove("disabled");
      }
    },
  };
})();

const session = (() => {
  let body = document.querySelector("body");

  const login = async () => {
    await request("POST", "/api/session")
      .body({
        email: body.getAttribute("data-email"),
        password: body.getAttribute("data-password"),
      })
      .then((res) => {
        if (res.code == 200) {
          localStorage.removeItem("token");
          localStorage.setItem("token", res.data.token);
          comment.ucapan();
        }
      })
      .catch((err) => {
        alert(`Terdapat kesalahan: ${err}`);
        window.location.reload();
        return;
      });
  };

  const check = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      const jwt = JSON.parse(atob(token.split(".")[1]));

      if (
        jwt.exp < new Date().getTime() / 1000 ||
        !jwt.iss.includes(new URL(window.location.href).host)
      ) {
        await login();
      } else {
        await comment.ucapan();
      }
    } else {
      await login();
    }
  };

  return { check };
})();

const like = (() => {
  const likes = storage("likes");

  const like = async (button) => {
    let token = localStorage.getItem("token");
    let id = button.getAttribute("data-uuid");

    if (!token) {
      alert("Terdapat kesalahan, token kosong !");
      window.location.reload();
      return;
    }

    let heart = button.firstElementChild.lastElementChild;
    let info = button.firstElementChild.firstElementChild;

    button.disabled = true;
    info.innerText = "Loading..";

    if (likes.has(id)) {
      await request("PATCH", "/api/comment/" + likes.get(id))
        .token(token)
        .then((res) => {
          if (res.data.status) {
            likes.unset(id);

            heart.classList.remove("fa-solid", "text-danger");
            heart.classList.add("fa-regular");

            info.setAttribute(
              "data-suka",
              (parseInt(info.getAttribute("data-suka")) - 1).toString()
            );
          }
        })
        .catch((err) => {
          alert(`Terdapat kesalahan: ${err}`);
        });
    } else {
      await request("POST", "/api/comment/" + id)
        .token(token)
        .then((res) => {
          if (res.code == 201) {
            likes.set(id, res.data.uuid);

            heart.classList.remove("fa-regular");
            heart.classList.add("fa-solid", "text-danger");

            info.setAttribute(
              "data-suka",
              (parseInt(info.getAttribute("data-suka")) + 1).toString()
            );
          }
        })
        .catch((err) => {
          alert(`Terdapat kesalahan: ${err}`);
        });
    }

    info.innerText = info.getAttribute("data-suka") + " suka";
    button.disabled = false;
  };

  return { like };
})();

// Fungsi untuk menambahkan data formulir ke dalam array di local storage
function simpanData() {
  // Mengambil nilai dari elemen formulir
  var nama = document.getElementById("form-nama").value;
  var kehadiran = document.getElementById("form-kehadiran").value;
  var pesan = document.getElementById("form-pesan").value;

  // Membuat objek untuk menyimpan data
  var data = {
    nama: nama,
    kehadiran: kehadiran,
    pesan: pesan,
  };

  // Ambil data yang sudah ada di local storage atau buat array kosong jika belum ada
  var dataFormulirArray =
    JSON.parse(localStorage.getItem("dataFormulirArray")) || [];

  // Tambahkan data baru ke dalam array
  dataFormulirArray.push(data);

  // Mengonversi array menjadi string JSON dan simpan di local storage
  localStorage.setItem("dataFormulirArray", JSON.stringify(dataFormulirArray));

  // Menampilkan pesan bahwa data berhasil disimpan (opsional)
  alert("Ucapan tersimpan, muat ulang untuk melihat ucapan yang anda kirim!");
}

// Fungsi untuk menampilkan data formulir dari local storage
function tampilkanDataDariLocalStorage() {
  var daftarUcapanElement = document.getElementById("list-ucapan");

  // Ambil data dari local storage
  var dataFormulirArray =
    JSON.parse(localStorage.getItem("dataFormulirArray")) || [];

  // Tampilkan data dalam bentuk card
  dataFormulirArray.forEach(function (data, index) {
    var card = document.createElement("div");
    card.className = "card m-2";

    card.innerHTML = `
      <div class="card-body">
        <p class="card-text"> ${data.nama}</p>
        <p class="card-text"> ${
          data.kehadiran === "1" ? "Hadir" : "Berhalangan"
        } - ${data.pesan}</p>
        <button class="btn btn-danger btn-sm" onclick="konfirmasiHapus(${index})">Hapus</button>
      </div>
    `;

    daftarUcapanElement.appendChild(card);
  });
}

// Panggil fungsi tampilkanDataDariLocalStorage saat halaman dimuat
window.onload = tampilkanDataDariLocalStorage;

// Fungsi untuk menampilkan pop-up konfirmasi sebelum menghapus data
function konfirmasiHapus(index) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    hapusData(index);
  }
}

// Fungsi untuk menghapus data formulir dari local storage berdasarkan indeks
function hapusData(index) {
  // Ambil data dari local storage
  var dataFormulirArray =
    JSON.parse(localStorage.getItem("dataFormulirArray")) || [];

  // Hapus data sesuai dengan indeks
  dataFormulirArray.splice(index, 1);

  // Simpan kembali data yang telah diubah ke local storage
  localStorage.setItem("dataFormulirArray", JSON.stringify(dataFormulirArray));

  // Muat ulang tampilan data
  tampilkanDataDariLocalStorage();
}
