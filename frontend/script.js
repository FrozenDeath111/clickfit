$(document).ready(() => {
  let $show_year = $("#show_year");
  let $show_text = $("#show_text");
  let $show_other_info = $("#show_other_info");

  $.ajax({
    type: "GET",
    url: "http://numbersapi.com/1/30/date?json",
    success: function (data) {
      //console.log(data);
      $show_year.html(`Year: ${data.year}`);
      $show_text.html(data.text);
      $show_other_info.append(`<li>Found: ${data.found}</li>`);
      $show_other_info.append(`<li>Number: ${data.number}</li>`);
      $show_other_info.append(`<li>Type: ${data.type}</li>`);
    },
    error: function () {
      alert("error when fetching data");
    },
  });
});

const dropzone = document.getElementById("drop_zone");
const inputFile = document.getElementById("input_file");

dropzone.addEventListener("click", (e) => {
  inputFile.click();
  inputFile.onchange = (e) => {
    upload(e.target.files[0]);
  };
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
});

dropzone.addEventListener("drop", async (e) => {
  e.preventDefault();

  if (e.dataTransfer.items[0].kind !== "file") {
    $("#drop_zone_msg").html("Not a File");
    throw new Error("Not a File");
  }

  if (e.dataTransfer.items.length > 1) {
    $("#drop_zone_msg").html("More than one File");
    throw new Error("More than one File");
  }

  const fileArray = [...e.dataTransfer.files];

  const isFile = await new Promise((resolve) => {
    const fileReader = new FileReader();
    fileReader.onprogress = (e) => {
      if (e.loaded > 50) {
        fileReader.abort;
        resolve(true);
      }
    };
    fileReader.onload = () => {
      resolve(true);
    };
    fileReader.onerror = () => {
      resolve(false);
    };
    fileReader.readAsArrayBuffer(e.dataTransfer.files[0]);
  });

  if (!isFile) {
    $("#drop_zone_msg").html("Can not be Folder");
    throw new Error("Can not be Folder");
  }

  upload(fileArray[0]);
});

function upload(file) {
  const formData = new FormData();
  formData.append("imageFile", file);
  console.log(file);

  const validFiles = ["jpg", "jpeg", "png", "svg"];
  const ext = file.name.split(".").pop();

  if (validFiles.includes(ext)) {
    $.ajax({
      type: "POST",
      url: "http://localhost:3000/uploads",
      data: formData,
      processData: false,
      contentType: false,
      enctype: "multipart/form-data",
      success: function (data) {
        console.log(data);
      },
      error: function (error) {
        console.log(error);
      },
    });
  } else {
    alert("invalid File Type, accepted -- jpg, jpeg, png, svg");
  }
}

$("#checkActive").on("click", function () {
  if ($(this).prop("checked")) {
    $("#checkLabel").html("Active");
  } else {
    $("#checkLabel").html("Not Active");
  }
});

$("#submit").click((e) => {
  e.preventDefault();
  let emailValid = null;
  let passwordValid = null;
  const email_val = $(email).val();
  const password_val = $(password).val();
  const type_val = $(type).val();
  let active = 0;

  if ($("#checkActive").prop("checked")) {
    active = 1;
  } else {
    active = 0;
  }

  console.log(email_val, password_val, type_val, active);

  filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  if (filter.test(email_val)) {
    console.log("Valid Email");
    emailValid = true;
  } else {
    console.log("Not Valid");
    emailValid = false;
  }

  if (password_val.length >= 8) {
    console.log("Valid Password");
    passwordValid = true;
  } else {
    console.log("Invalid Password");
    passwordValid = false;
  }

  if (!emailValid && !passwordValid) {
    console.log("Both not valid");
    $("#form_error_msg").html("Invalid email and password");
  }

  if (!emailValid) {
    $("#form_error_msg").html("Invalid Email");
  }

  if (!passwordValid) {
    $("#form_error_msg").html("Invalid Password");
  }

  if (emailValid && passwordValid) {
    const userData = {
      email: email_val,
      password: password_val,
      type: type_val,
      active: active,
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3000/user/create",
      data: userData,
      success: function (data) {
        console.log(data);
        localStorage.setItem("email", data.email);
        localStorage.setItem("type", data.type);
      },
      error: function (error) {
        alert(error);
      },
    });
  }

  $(email).val("");
  $(password).val("");
  $("#checkActive").prop("checked", false);
});
