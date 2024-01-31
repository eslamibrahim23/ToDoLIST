/*
Copyright 2016 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
var month;
var idbApp = (function () {
  "use strict";

  //to create database with name ToDoDatabase in IndexDB in the browser
  var dbPromise = idb.open("ToDoDatabase", 2, function (upgradeDB) {
    switch (upgradeDB.oldVersion) {
      case 1:
        //to create table with name toDOlist database with name ToDoDatabase in IndexDB in the browser
        upgradeDB.createObjectStore("toDOlist", { keyPath: "id" });
        break;
    }
  });

  function addOneOfList() {
    dbPromise.then((db) => {
      //transaction
      var tx = db.transaction("toDOlist", "readwrite");
      //Store
      var store = tx.objectStore("toDOlist");

      var add = document.getElementById("add");
      var title = document.getElementById("title").value;
      var Year = document.getElementsByTagName("select")[2].value;
      var Months = document.getElementsByTagName("select")[1].value;
      var Day = document.getElementsByTagName("select")[0].value;
      var Hours = document.getElementById("Hours").value;
      var Mins = document.getElementById("Mins").value;
      var veiwdate = new Date(
        Number(Year),
        Number(Months),
        Number(Day),
        Number(Hours),
        Number(Mins)
      );
      var month;

      //to write in ui the name of month in chars
      switch (veiwdate.getMonth()) {
        case 0:
          month = "January";
          break;
        case 1:
          month = "February";
          break;
        case 2:
          month = "March";
          break;
        case 3:
          month = "April";
          break;
        case 4:
          month = "May";
          break;
        case 5:
          month = "June";
          break;
        case 6:
          month = "July";
          break;
        case 7:
          month = "August";
          break;
        case 8:
          month = "September";
          break;
        case 9:
          month = "October";
          break;
        case 10:
          month = "November";
          break;
        case 11:
          month = "December";
          break;
      }

      //object will store in the table  of toDOlist in database of indexDB
      const toDOlist = {
        id: add.childElementCount,
        title: title,
        date: veiwdate,
        notify: false,
      };
      return store
        .add(toDOlist)
        .then(() => {
          add.innerHTML += `<h4  value='${toDOlist.id}' > ${
            toDOlist.title
          } --- ${toDOlist.date.getDate()},${month},${toDOlist.date.getFullYear()}, 
          <button onclick="idbApp.delete_one_of_list(${
            toDOlist.id
          })">Delete</button></h4>`;
          var time_fire_SetTimeout = toDOlist.date - Date.now();
          // console.log(time_fire_SetTimeout);
          //to fire function notifcation when diffenet time =0
          notifcation(
            toDOlist.id,
            toDOlist.title,
            time_fire_SetTimeout,
            toDOlist.notify
          );
        })

        .catch((err) => {
          console.log(err);
        });
    });
  }

  //delete an object in the table of toDOlist in database of indexDB
  function delete_one_of_list(key) {
    dbPromise.then((db) => {
      var tx = db.transaction("toDOlist", "readwrite");
      var store = tx.objectStore("toDOlist");
      return store
        .delete(key)
        .then(() => {
          document.querySelector(`h4[value="${key}"]`).remove();
        })
        .catch(() => {
          tx.abort();
        });
    });
  }

  //fire notifcation
  function notifcation(key, toDOlist_title, time, toDOlist_notify) {
    setTimeout(() => {
      if ("Notification" in window) {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            const notification = new Notification("Do your task", {
              body: toDOlist_title,
              icon: "../image/R.png",
            });
            document
              .querySelector(`h4[value="${key}"]`)
              .setAttribute("class", "text-decoration-line-through");
            dbPromise.then((db) => {
              var tx = db.transaction("toDOlist", "readwrite");
              var store = tx.objectStore("toDOlist");
              return store.get(key).then((toDOlist) => {
                if (toDOlist) {
                  toDOlist.notify = true;
                  store.put(toDOlist);
                }
              });
            });
          } else {
            console.warn("Notification permission denied");
          }
        });
      }
    }, time);
  }

  //when refershing the page ---> the page will lost all object and it will cause a problem in id counter
  //to save all objects in ui and get its from  the table of toDOlist in database of indexDB of the browser
  // so id before refresh = id after refresh
  //this function will solve this problem
  (function () {
    return dbPromise.then((db) => {
      var tx = db.transaction("toDOlist", "readonly");
      var store = tx.objectStore("toDOlist");
      return store
        .getAll()
        .then((toDOlist) => {
          var add = document.getElementById("add");
          toDOlist.forEach((ele) => {
            switch (ele.date.getMonth()) {
              case 0:
                month = "January";
                break;
              case 1:
                month = "February";
                break;
              case 2:
                month = "March";
                break;
              case 3:
                month = "April";
                break;
              case 4:
                month = "May";
                break;
              case 5:
                month = "June";
                break;
              case 6:
                month = "July";
                break;
              case 7:
                month = "August";
                break;
              case 8:
                month = "September";
                break;
              case 9:
                month = "October";
                break;
              case 10:
                month = "November";
                break;
              case 11:
                month = "December";
                break;
            }
            add.innerHTML += `<h4 value='${ele.id}'> ${
              ele.title
            } --- ${ele.date.getDate()},${month},${ele.date.getFullYear()}, 
          <button onclick="idbApp.delete_one_of_list(${
            ele.id
          })">Delete</button></h4>`;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  })();

  return {
    dbPromise: dbPromise,
    delete_one_of_list: delete_one_of_list,
    addOneOfList: addOneOfList,
  };
})();
