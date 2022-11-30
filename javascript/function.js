const fileListCheck = function (fileList) {
  let result = true;

  return new Promise((resolve, reject) => {
    for (let i = 0; i < fileList.length; i++) {
      if (
        fileList[i].name.split(".")[1] !== "mp3" &&
        fileList[i].name.split(".")[1] !== "mp4" &&
        fileList[i].name.split(".")[1] !== "wav"
      ) {
        alert("mp3, mp4, wav이 아닌 파일은 등록할 수 없습니다.");
        result = false;
        break;
      }
    }
    resolve(result);
    reject("fileListCheck fail");
  });
};

const createPlayList = function (fileList) {
  let musicInfoObj = {};
  const returnObj = {};

  return new Promise((resolve, reject) => {
    for (let i = 0; i < fileList.length; i++) {
      JSMEDIATAGES.read(fileList[i], {
        onSuccess: function (tag) {
          const data = tag.tags.picture.data;
          const format = tag.tags.picture.format;

          let base64string = "";

          for (let j = 0; j < data.length; j++) {
            base64string += String.fromCharCode(data[j]);
          }

          musicInfoObj.audioUrl = URL.createObjectURL(fileList[i]);
          musicInfoObj.imgUrl = `url(data:${format};base64,${window.btoa(
            base64string
          )})`;

          musicInfoObj.title =
            tag.tags.title.length > 25
              ? tag.tags.title.substring(0, 25) + "..."
              : tag.tags.title;

          musicInfoObj.artist =
            tag.tags.artist.length > 30
              ? tag.tags.artist.substring(0, 30) + "..."
              : tag.tags.artist;

          returnObj[Date.now()] = musicInfoObj;
          musicInfoObj = {};

          resolve(returnObj);
        },
        onError: function (error) {
          reject(error);
        },
      });
    }
  });
};

const playMusic = function (objId) {
  const targetObj = PLAY_LIST_INFO_OBJ_GLOBAL[objId];

  AUDIO.id = objId;
  AUDIO.src = targetObj.audioUrl;
  BACKGROUND.style.backgroundImage = targetObj.imgUrl;
  DISK.style.backgroundImage = targetObj.imgUrl;
  TITLE.textContent = targetObj.title;
  ARTIST.textContent = targetObj.artist;
  AUDIO.play();
};

const changeMusic = function (eventId, fileList, id) {
  if (fileList === null || id === "") return;
  const musicIndex =
    eventId === "prev-btn"
      ? Object.keys(fileList).indexOf(id) - 1
      : Object.keys(fileList).indexOf(id) + 1;
  return Object.keys(fileList)[musicIndex];
};

const changeTimeAtOnce = function (time) {
  let minute = parseInt(time / 60);
  let second = parseInt(time - 60 * minute);

  minute < 10 ? (minute = "0" + minute) : minute;
  second < 10 ? (second = "0" + second) : second;

  return [minute, second];
};

const changeTimeToRealTime = function (time) {
  let currentMinute = parseInt(time / 60);
  let currentSceond = parseInt(time - 60 * currentMinute);

  currentMinute < 10 ? (currentMinute = "0" + currentMinute) : currentMinute;
  currentSceond < 10 ? (currentSceond = "0" + currentSceond) : currentSceond;

  return [currentMinute, currentSceond];
};

const setCurrentTime = function (time) {
  return time;
};

const setTimeline = function (value) {
  return value;
};

const setVolume = function (value) {
  return value * 0.01;
};

const setLoop = function (loop) {
  return loop;
};

const setMuted = function (mute) {
  return mute;
};
