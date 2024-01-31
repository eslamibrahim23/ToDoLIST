var add = document.getElementsByClassName("add")[0];
var title = document.getElementById("title").value;
var Year = document.getElementById("Year").value;
var Months = document.getElementById("Months").value;
var Day = document.getElementById("Day").value;
var Hours = document.getElementById("Hours").value;
var Mins = document.getElementById("Mins").value;

var btn = document.getElementsByClassName("Addbtn")[0];
btn.addEventListener("click", (e) => {
  // console.log();
  console.log(Year);
  console.log(Months);
  // var Month = Months.value - 1;
  // console.log(Number(Hours.value));
  // var veiwdate = new Date(
  //   Number(Year.value),
  //   Number(Month),
  //   Number(Day.value),
  //   Number(Hours.value),
  //   Number(Mins.value)
  // );
  // console.log(add);
  // add.innerText = `${title.value} - ${veiwdate}`;
  // add.style.display = "block";
  // console.log(veiwdate);
});


