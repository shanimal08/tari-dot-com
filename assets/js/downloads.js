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
        groupDataByOs(res.files);
        setLatest(res.latest);
      }
    });
  }

  function groupDataByOs(data) {
    let linux = [];
    let windows =  [];
    let osx = [];
    let libWallet = [];
    let sortedFiles = {}

    data.forEach((file)=> {
      const type = file.path.split('/')[0];
      switch (type) {
        case 'linux':
          linux.push(file);
          break;
        case 'windows':
          windows.push(file)
          break;
        case 'osx':
          osx.push(file);
          break;
        default:
         libWallet.push(file);
      }
       sortedFiles = {
        linux, windows, osx, libWallet
      }
    })
    Object.keys(sortedFiles).forEach((os)=>{
      renderBinaries(sortedFiles[os], os)
    })
  }

  function renderBinaries(data, os) {
    let binContainer = document.getElementById(`${os}BinID`);
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
        let checkSumDiv = document.getElementById(`${os}CSID`);

        let sha256 = "";
        let checksum = data[os].sha256;

        if (checksum) {
          sha256 = checksum.split(" ")[0];
        }

        btn.href = data[os].url;

        checkSumDiv.innerHTML = checksum ? `SHA256: ${sha256}` : "";
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
