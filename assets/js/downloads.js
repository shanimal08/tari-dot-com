let OS = "";
function getOS() {
  let platform = window.navigator.platform,
    macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
    windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
    os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = "Mac OS";
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = "Windows";
  } else if (!os && /Linux/.test(platform)) {
    os = "Linux";
  }

  OS = os;
}
getOS();

function selectedOs(element, cardElement) {
  let el = document.getElementById(element);
  let cardEl = document.getElementById(cardElement);
  let oldActiveBtn = document.getElementsByClassName("tab-button");
  let oldActive = document.getElementsByClassName("download-content");

  removeClass(oldActive);
  removeClass(oldActiveBtn);

  el.classList.add("active");
  cardEl.classList.add("active");
}

function removeClass(elems) {
  for (let i = 0; i < elems.length; i++) {
    elems[i].classList.remove("active");
  }
}

jQuery(document).ready(function($) {
  getS3Data()
  //get data
  function getS3Data() {
    $.ajax({
      url: Tari.s3BucketURL,
      headers: { "Access-Control-Allow-Origin": "*" },
      success: function(res) {
        renderBinaries(res.files);
        setLatest(res.latest);
      }
    });
  }

  function renderBinaries(data) {
    let binContainer = document.getElementById('libBinaries');
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };

    binContainer.innerHTML = data.map(( binary, index) => {
      const lastMod = new Date(binary.lastModified);
      const formattedDate = lastMod.toLocaleString(undefined, dateOptions);
      const formattedTime = lastMod.getHours() + ':' + lastMod.getMinutes();
      const altClass = index % 2 ? '' : 'alt-colour'
      const path = binary.path.split("/").pop();

      return (
         `<div class="bin-row ${altClass}">
            <div class="bin-row-item bin-left" scope="row">
              <a href="${binary.url}">
                ${path}
              </a>
              </div>
            <div class="bin-row-item bin-right">${formattedDate} at ${formattedTime}</div>
          </div>`
      )
    }).join('')
  }

  function setLatest(data) {
    Object.keys(data).forEach((os) => {
      if (os !== 'libwallet'){
        let btn = document.getElementById(`${os}DL`);
        btn.href = data[os].url;
      }
    })
  }

  function setInitialActive(os) {
    switch (os) {
      case "Mac OS":
        $("#mac-btn").addClass("active");
        $("#mac").addClass("active");
        break;
      case "Windows":
        $("#windows-btn").addClass("active");
        $("#windows").addClass("active");
        break;
      default:
        $("#ubuntu-btn").addClass("active");
        $("#ubuntu").addClass("active");
        break;
    }
  }
  setInitialActive(OS);
});
