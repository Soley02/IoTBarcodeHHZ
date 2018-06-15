(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('Home.IndexController', Controller);

    function Controller(UserService) {
        var vm = this;

        vm.user = null;

        initController();

        var sum=0.00;
        document.getElementsByName('summe2')[0].setAttribute("value", parseFloat(Math.round(sum * 100) / 100).toFixed(2)+" €");

        // [ Barcode-ID, Item, Description, Price, Number]
        var items = [
            [ "00000017", "Nudeln", "DescriptionNudeln", "1.99", "0"],
            [ "00000024", "Eier", "DescriptionEier", "3.49", "0"],
            [ "00000031", "Eis", "DescriptionEis", "0.50", "0"],
            [ "00000048", "Bier", "DescriptionBier", "6.91", "0"],
            [ "00000079", "Chips", "DescriptionChips", "2.49", "0"],
            [ "00000062", "Zeitung", "DescriptionZeitung", "0.99", "0"],
            [ "00000055", "Orangensaft", "DescriptionOrangensaft", "1.49", "0"]        
        ];

        //[Barcode, Client-ID, Wunderlist-Token, Wunderlist-List-ID, isCurrentUser, Wunderlist-History-List-ID]
        var users = [
            [ "90311017","588538a81d23d9275ed7", "3d11ca29b52057ec511cf487c84ee4e655f5d829083ed8ddc17cdc925000", "353993604","0","353993625"],
            [ "00000086","c6cbc57bcc2adfe80be4", "af9b424386d056070502f4a88b266f4c92d2a6d5d4eed4affec5ec50981b", "353992302","0","353992384"]
        ];

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });

        }

        var modal = document.getElementById('myModal');
        var span = document.getElementsByClassName("close")[0];
        var scanner = document.getElementById('scanner-container');

        var dataSet =[];
         
        $(document).ready(function() {
            var datatable =$('#example').DataTable( {
                data: dataSet,
                columns: [
                    { title: "#" },
                    { title: "ID" },
                    { title: "Beschreibung" },
                    { title: "Preis" }
                ],
                "paging": false,
                "info": false,
                "scrollY":  '65vh',
                "scrollCollapse": true,
                "searching": false, 
                "ordering": false,   
            } );

           
        var _scannerIsRunning = false;
        startScanner();

        function startScanner() {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#scanner-container'),
                    constraints: {
                        width: 709,
                        height: 180,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: [
                        "ean_8_reader"
                    ],
                    debug: {
                        showCanvas: false,
                        showPatches: false,
                        showFoundPatches: false,
                        showSkeleton: false,
                        showLabels: false,
                        showPatchLabels: false,
                        showRemainingPatchLabels: false,
                        boxFromPatches: {
                            showTransformed: false,
                            showTransformedBox: false,
                            showBB: false
                        }
                    }
                },

            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }

                console.log("Initialization finished. Ready to start");
                Quagga.start();

                // Set flag to is running
                _scannerIsRunning = true;
            });

            /* //default setting
            function startScanner() {
            Quagga.init({
                inputStream: {
                    name: "Live",
                    type: "LiveStream",
                    target: document.querySelector('#scanner-container'),
                    constraints: {
                        width: 480,
                        height: 320,
                        facingMode: "environment"
                    },
                },
                decoder: {
                    readers: [
                        "code_128_reader",
                        "ean_reader",
                        "ean_8_reader",
                        "code_39_reader",
                        "code_39_vin_reader",
                        "codabar_reader",
                        "upc_reader",
                        "upc_e_reader",
                        "i2of5_reader"
                    ],
                    debug: {
                        showCanvas: true,
                        showPatches: true,
                        showFoundPatches: true,
                        showSkeleton: true,
                        showLabels: true,
                        showPatchLabels: true,
                        showRemainingPatchLabels: true,
                        boxFromPatches: {
                            showTransformed: true,
                            showTransformedBox: true,
                            showBB: true
                        }
                    }
                },

            }, function (err) {
                if (err) {
                    console.log(err);
                    return
                }

                console.log("Initialization finished. Ready to start");
                Quagga.start();

                // Set flag to is running
                _scannerIsRunning = true;
            }); */

            /* Quagga.onProcessed(function (result) {
                var drawingCtx = Quagga.canvas.ctx.overlay,
                drawingCanvas = Quagga.canvas.dom.overlay;

                if (result) {
                    if (result.boxes) {
                        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                        result.boxes.filter(function (box) {
                            return box !== result.box;
                        }).forEach(function (box) {
                            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                        });
                    }

                    if (result.box) {
                        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
                    }

                    if (result.codeResult && result.codeResult.code) {
                        Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            
                    }
                }
            }); */


            

            Quagga.onDetected(function (result) {
               
                    console.log(modal.style.display);
                    if(modal.style.display != "flex"){
                        var identifiedItem, descr, price, number;
                        
                        var i;
                        for ( i=0; i<=items.length-1; i++ ) {
                            if(items[i][0]==result.codeResult.code) {

                                identifiedItem=items[i][1];
                                descr=items[i][1];
                                price=items[i][3];
                                number=parseInt(items[i][4])+1;
                                items[i][4]=number;

                                if (confirm(identifiedItem+" detected!")) {
                                    //push data
                                    if(number==1){
                                        dataSet.push([1, result.codeResult.code.slice(0, -1), descr, price]);
                                    }else{
                                        var j
                                        for ( j=0; j<=dataSet.length-1; j++ ) {
                                            if(dataSet[j][1]==result.codeResult.code.slice(0, -1)) {
                                                dataSet[j][0]=parseInt(dataSet[j][0])+1;
                                            }
                                        }
                                    }
                                    
                                    //refresh table
                                    datatable.clear();
                                    datatable.rows.add(dataSet);
                                    datatable.draw();
                        
                                    
                                    //calc sum
                                    sum=sum+parseFloat(price);
                                    document.getElementsByName('summe2')[0].setAttribute("value", parseFloat(Math.round(sum * 100) / 100).toFixed(2)+" €");
            
                                }
                            }
                        }
                    }else{
                        var wId, wName, wEmail, wType;
                        
                        var i;
                        for ( i=0; i<=users.length-1; i++ ) {
                            if(users[i][0]==result.codeResult.code) {
                                
                                if (confirm(users[i][0]+" detected!")) {
                                    var ID=users[i][1];
                                    var TOKEN=users[i][2];
                                    users[i][4]="1";

                                    UserService.getUserInformation(ID, TOKEN).then(function (user) {
                                        console.log(user);

                                        wId=user.id;
                                        wName=user.name;
                                        wEmail=user.email;
                                        wType=user.type;

                                        document.getElementById('wId').setAttribute("value", wId);
                                        document.getElementById('wName').setAttribute("value", wName);
                                        document.getElementById('wEmail').setAttribute("value", wEmail);
                                        document.getElementById('wType').setAttribute("value", wType);

                                        document.getElementById("checkout").disabled=false;
                                    });
                                }
                            }
                        }
                    }
                                               
            });

            /* Quagga.onDetected(function (result) {
                //console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);

                var identifiedItem, descr, price, number;
                //console.log(items);
                var i;
                for ( i=0; i<=8; i++ ) {
                    if(items[i][0]==result.codeResult.code) {
                        identifiedItem=items[i][1];
                        descr=items[i][1];
                        price=items[i][3];
                        number=parseInt(items[i][4])+1;
                        items[i][4]=number;
                    }
                }

                if(identifiedItem!=null){
                    if (confirm(identifiedItem+" detected!")) {
                        //push data
                        if(number==1){
                            dataSet.push([1, result.codeResult.code.slice(0, -1), descr, price]);
                        }else{
                            var j
                            for ( j=0; j<=dataSet.length-1; j++ ) {
                                if(dataSet[j][1]==result.codeResult.code.slice(0, -1)) {
                                    dataSet[j][0]=parseInt(dataSet[j][0])+1;
                                }
                            }
                        }
                        
                        //refresh table
                        datatable.clear();
                        datatable.rows.add(dataSet);
                        datatable.draw();
               
                        
                        //calc sum
                        sum=sum+parseFloat(price);
                        document.getElementsByName('summe2')[0].setAttribute("value", parseFloat(Math.round(sum * 100) / 100).toFixed(2)+" €");

                    } else {
                        
                    }
                }
                

                
            }); */

            

        };



        document.getElementById("smartCheckout").addEventListener("click", function () {
            modal.style.display = "flex";
            scanner.style.position = "fixed";
            document.getElementById('wId').setAttribute("value", "");
            document.getElementById('wName').setAttribute("value", "");
            document.getElementById('wEmail').setAttribute("value", "");
            document.getElementById('wType').setAttribute("value", "");
            document.getElementById("checkout").disabled=true;
        }, false); 

        document.getElementById("cancel").addEventListener("click", function () {
            modal.style.display = "none";
            scanner.style.position = "inherit";

            var j
            for ( j=0; j<=users.length-1; j++ ) {
                users[j][4]=0;
            }
        }, false); 

        document.getElementById("checkout").addEventListener("click", function () {
            var j
            for ( j=0; j<=users.length-1; j++ ) {
                if(users[j][4]==1){
                    var ID=users[j][1];
                    var TOKEN=users[j][2];
                    var LISTID=users[j][3];
                    var HistoryID=users[j][5];

                    UserService.getTasks(ID,TOKEN,LISTID).then(function (tasks) {
                        console.log(tasks);

                        var ctasks=[];

                        var j;
                        for ( j=0; j<=tasks.length-1; j++ ) {
                            var i;
                            for ( i=0; i<=dataSet.length-1; i++ ) {
                                    if(tasks[j].title==dataSet[i][2]){
                                        ctasks.push([tasks[j].title]);

                                        //http call update list                                        
                                        UserService.completeTasks(ID,TOKEN,tasks[j].id,tasks[j].revision).then(function (test) {
                                            console.log(test.completed_at);

                                            
                                        }); 

                                        /* //http call rename list                                        
                                        UserService.completeTasks(ID,TOKEN,tasks[j].id,tasks[j].revision,tasks[j].title).then(function (test) {
                                            console.log(test.completed_at);

                                            
                                        }); */



                                        /* //http call reminder
                                            UserService.setReminder(ID,TOKEN,tasks[j].id,new Date()).then(function (test2) {
                                            console.log(test2);
                                        }); */
                                        

                                    
                                    }
                            }   
                        }

                        console.log("length: "+ctasks.length)
                        if(ctasks.length>-1){
                            //http create summary task
                            UserService.createSumTask(ID,TOKEN,HistoryID,ctasks.length).then(function (test3) {
                                console.log(test3);

                                //http call reminder
                                UserService.setReminder(ID,TOKEN,test3.id,new Date()).then(function (test2) {
                                    console.log(test2);
                                });

                                 //http call subtasks
                                 UserService.createSubtasks(ID,TOKEN,test3.id,ctasks,dataSet).then(function (test2) {
                                    console.log(test2);

                                    dataSet=[];
                                });
                            });

                        }
    
                    });
                }
            }
            
            modal.style.display = "none";
            scanner.style.position = "inherit";

            var j
            for ( j=0; j<=users.length-1; j++ ) {
                users[j][4]=0;
            }

           //delete from table
           datatable.clear();
           datatable.rows.add();
           datatable.draw();

            //calc sum
            sum=0.00;
            document.getElementsByName('summe2')[0].setAttribute("value", parseFloat(Math.round(sum * 100) / 100).toFixed(2)+" €");
             
        }, false); 

        span.onclick = function() {
            modal.style.display = "none";
            scanner.style.position = "inherit";

            var j
            for ( j=0; j<=users.length-1; j++ ) {
                users[j][4]=0;
            }
            
        };
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
                scanner.style.position = "inherit";
            }
        };
        
        document.getElementById("delete").addEventListener("click", function () {
            dataSet =[];

            var j
            for ( j=0; j<=items.length-1; j++ ) {
                items[j][4]=0;
            }
            
            //delete from table
            datatable.clear();
            datatable.rows.add(dataSet);
            datatable.draw();
           
            //calc sum
           sum=0;
           document.getElementsByName('summe2')[0].setAttribute("value", parseFloat(Math.round(sum * 100) / 100).toFixed(2)+" €"); 
        }, false); 

       /*  document.getElementById("payback").addEventListener("click", function () {
            //http call update list                                        
            UserService.completeTasks('9cfc229461547aff98f1','5b264fb746bda3201c76b04f561a3c9e74d09d2b397bb4d58e317a5a30ad','3926034912','7').then(function (test) {
                console.log("cTasks: "+test);
            });
        }, false);  */

        /* // Start/stop scanner
        document.getElementById("btn").addEventListener("click", function () {
            if (_scannerIsRunning) {
                Quagga.stop();
            } else {
                startScanner();
            }
        }, false); */
        

        } );  
        
    }

})();

