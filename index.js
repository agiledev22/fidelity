
$(document).ready(function(){

    let sessionId = '';
    let role = '';
    let loggedIn = false;
    let emailReady = false;
    let oldPswdReady = false;
    let newPswdReady = false;
    let mtchPswdReady = false;
    let pswdAlert = '';
    let currentPassword = ''
    showLogin();



    //login page start
    $('#forgotpass').click(function(){
        showRetrievePassword();
    })

    $('#btn-login').click(function(){
        login();
    })
    //login page end


    //retrieve password page start
    $('#fidelityretrievepassword .send').click(function(){
        var email = $('#password-send-email').val();
        if(email != '')
        {
            retrievePassword(email);
        }
        else{
            showModal('Error', 'Email field is required!');
        }
    })
    //retrieve password page end


    //admin all cards start
    $('#btn-create-card').click(function(){
        showCreateCard();
    })

    $('#btn-admin-account').click(function(){
        var userid = $(this).attr('userid')
        var username = $(this).attr('username')
        var email = $(this).attr('email')

        updateAdminAccountUI(userid, username, email);
        showAdminaccount();
    })

    $('.show-login').click(function(){
        showLogin();
    })

    $('#fidelityadminhome .searchbox').click(function(){
        var filter_key = $('#cards_search_filter').val();
        filterCardsList(filter_key);
        $('#cards_search_filter').val('');

    })
    //admin all cards end


    //admin account edit start

    $('.show-admin-home').click(function(){
        showAdminhome();
    })
    $('#fidelityadminaccount .save').click(function(){
        var userid = $(this).attr('userid')
        var email = $('#admin-account-email').val();
        var username = $('#admin-account-username').val();
        var password = $("#admin-account-password").val();

        if(password!='' && email!='' && username!='')
            updateUser(userid, email, username, password);
        else
            alert('Fill in the required fields!')
    })
    //admin account edit end


    //admin create card start
    $('#btn-back-client-home').click(function(){
        showAdminhome();
    })

    $('#btn-admin-create-card').click(function(){
        var email = $('#admin-clientemail').val();
        var fullname = $('#admin-clientname').val();

        createCard(email, fullname);
    })
    //admin create card end


    //admin client all transactions start
    $('#btn-show-client-account').click(function(){
        var userid = $(this).attr('userid');
        var username = $(this).attr('username');
        var email = $(this).attr('email');

        updateAdminClientAccountUI(userid, username, email);
        showAdminclientAccount();
    })

    $('.buybox').click(function(){
        prependTransactionsTable(3);
    })

    $('.plusminusbox .minusbutton').click(function(){
        prependTransactionsTable(1);
    })

    $('.plusminusbox .plusbutton').click(function() {
        prependTransactionsTable(2);
    })

    $('#fidelityadminclient .save').click(function() {
        var cardid = $(this).attr('cardid');
        saveAddedTransactions(cardid);
    })
    $('#credit-amount').keyup(function(){
        var adjusted = Math.abs(Number($(this).val()))
        console.log(adjusted)

        $(this).val(adjusted);
    })

    // $(staticAncestors).on(eventName, dynamicChild, function() {});

    $('#fidelityadminclient').on('click', '.historyvaluerow', function(){
        console.log('clicked')
        if(confirm("Would you like to delete this entry??")){
            if($(this).hasClass('bufferitem'))
                $(this).remove();
            else
                deleteTransaction($(this).attr('transaction_id'));
        }
    })
    //admin client all transactions end



    //admin client account edit start

    $('#fidelityadminclientaccount .buttoncontainer .show-client').click(function(){
        showAdminclientTransactions();
    })

    $('#fidelityadminclientaccount .inputcontainer .deleteaccount').click(function(){
        var user_id = $('#admin-client-account-save').attr('userid')
        deleteUser(user_id)
    })

    $('#admin-client-account-save').click(function(){
        var username = $('#admin-client-account-name').val();
        var email = $('#admin-client-account-email').val();
        var userid = $(this).attr('userid');
        if(username!='' && email!='')
        {
            updateUser(userid, email, username)
        }
    })
    //admin client account edit end




    //client home(all transactions) start
    $('#btn-client-edit-account').click(function(){
        var userid = $(this).attr('userid')
        var username = $(this).attr('username')
        var email = $(this).attr('email')

        updateClientAccountUI(userid, username, email);
        showClientAccount();
    })
    //client home(all transactions) end


    //client account edit start

    $('#fidelityclientaccount .back').click(function(){
        showClientTransactions();
    })
    $('#fidelityclientaccount .show-client').click(function(){
        showClientTransactions();
    })
    $('#fidelityclientaccount .save').click(function(){
        if (confirm('You want to update?')) {
            var username = $('#client-account-name').val();
            var email = $('#client-account-email').val();
            var userid = $(this).attr('userid');
            var password = $('#client-account-password').val();

            if(username!='' && email!='')
            {
                updateClient(userid, email, username, password)
            }
        } else {
          // Do nothing!
        }

    })
    //client account edit end

    function filterCardsList(filter_key)
    {
        var container = $('#fidelityadminhome .historycontainer')
        var items = $('#fidelityadminhome .historyvaluerow');
        items.removeClass('highlighted');
        var cnt = 0;
        if(filter_key != ''){
            items.each(function(){
                var card_id = $(this).find('.cardidvalue').text();
                if(card_id.indexOf(filter_key) >= 0){
                    $(this).addClass('highlighted');
                }
                cnt++;
                if(cnt == items.length){
                    $(items.get().reverse()).each(function() { 
                        if($(this).hasClass('highlighted')){
                            container.prepend($(this))
                        }
                    });
                }
            })
        }
    }



    function deleteUser(user_id)
    {
        if (confirm('Are you sure you want to delete this user?')) {
            let data = {userid:user_id};

            $.post(window.location.origin + "/ClientCredits/fidelity/ws/deleteUser.php",
                data,
                function(res, status){

                    if(status == 'success')
                    {
                        showAdminhome();
                    }
                    else
                    {
                        showModal("Error", res);
                    }
                });
        } else {
          // Do nothing!
        }


    }

    function postAjax(url, data, success, error) {
        var params = typeof data == 'string' ? data : Object.keys(data).map(
                function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
            ).join('&');

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) {
                success(xhr.responseText); 
            }else{
                if(typeof error === "function" && xhr.readyState>3){
                    showModal("Error", xhr.responseText);    
                }
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(params);
        return xhr;
    }

    function postAjaxFD(url, data, success, error) {
        
        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        xhr.open('POST', url);
        xhr.onreadystatechange = function() {
            if (xhr.readyState>3 && xhr.status==200) {
                success(xhr.responseText); 
            }else{
                if(typeof error === "function"){
                    error(xhr.responseText);    
                }
            }
        };
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
        return xhr;
    }

    function showSnackBar(msg) {
        // $("#messagebox").addClass("show");
        // $("#snackbar").html(msg);
        // setInterval(function(){ $('#messagebox').removeClass('show'); console.log('asdfs')}, 3000);
    }

    function toggleAttached(element){
        (element.nextElementSibling.getAttribute("hidden"))?
        (element.nextElementSibling.removeAttribute("hidden")):
        (element.nextElementSibling.setAttribute("hidden","hidden"))
    }

    function confirmGetNewPassword() {
        showSnackBar("TO DO");
    }

    function confirmChangePassword(){
        var oldPswd = document.getElementById('oldPswd').value;
        var newPswd= document.getElementById('newPswd').value;
        
        var data = JSON.stringify({"sessionId": sessionId,"pswd": oldPswd, "npswd": newPswd});
        postAjax("https://tools.mynoomi.com/wsStudioLegale/changePwd.php",data,
            function(data){
                showSnackBar(data);
                cancelPopups();
            },
            function(error){
                showSnackBar(error);
                document.getElementById("oldPswd").classList.remove("green");
                document.getElementById("oldPswd").classList.add("red");
                
            }
        )
    }

    function changePassword() {
        document.getElementById("popuppassword").removeAttribute("hidden");
        let node = document.querySelectorAll(".popupelementstablebox");
        for (let i = 0; i < node.length; i++) {
            node[i].classList.remove("green");
            node[i].classList.add("red");
        }
        pswdFormReady();
    }

    function getNewPassword() {
        document.getElementById("popupgetnewpassword").removeAttribute("hidden");
        validateEmail(document.getElementById("email"));
    }

    function validateOldPswd(element) {
        if(element.value.length > 3){
            element.classList.remove("red");
            element.classList.add("green");
            oldPswdReady=true;
        }else{
            element.classList.remove("green");
            element.classList.add("red");
            oldPswdReady=false;
        }
        pswdFormReady()
    }

    function validateNewPswd(element) {
        if ((element.value.length > 7) &&     
           (element.value.match(/[a-z]/)) &&
           (element.value.match(/[A-Z]/)) &&
           //(element.value.match(/[\!\@\#\$\%\^\&\*\?\_\~\-\(\)]+/)) &&
           (element.value.match(/[0-9]/))) {
            element.classList.remove("red");
            element.classList.add("green");
            newPswdReady=true;
        }else{
            element.classList.remove("green");
            element.classList.add("red");
            newPswdReady=false;
        }
        pswdFormReady();
    }

    function validateMtchPswd(element) {
        if(element.value == document.getElementById("newPswd").value){
            element.classList.remove("red");
            element.classList.add("green");
            mtchPswdReady=true;
        }else{
            element.classList.remove("green");
            element.classList.add("red");
            mtchPswdReady=false;
        }
        pswdFormReady();
    }

    function pswdFormReady() {
        if(oldPswdReady&&newPswdReady&&mtchPswdReady){
            pswdAlert = "";
            document.querySelectorAll(".popupelementtablebuttons")[0].classList.remove("disabled");
            return true;
        }else{
            document.querySelectorAll(".popupelementtablebuttons")[0].classList.add("disabled");
            if(!oldPswdReady){
                pswdAlert = "Check Old Password";
            }else if(!newPswdReady){
                pswdAlert = "<div style='text-align:left'> Rules for new Password:"+
                            "<br/>1. At least 8 characters long."+
                            "<br/>2. At least 1 number."+
                            "<br/>3. At least 1 capital letter."+
                            "<br/>4. At least 1 lowercase letter."+
                            //<br/>5. At least 1 of the following characters:
                            //<br/>! @ + # $ % ^ & * , ? _ ~ - ( )  
                            "<br/>Spaces are not allowed.</div>";
            }else{
                pswdAlert = "New Passwords Mismatch";
            }
        }
    }

    function validateEmail(element) {
        if (//(element.value.length > 4) && 
            //(element.value.match(/[\@]/)) &&
            //(element.value.match(/[\.]/))) {
            (element.value.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/))) {
            element.classList.remove("red");
            element.classList.add("green");
            document.querySelectorAll(".popupelementtablebuttons")[2].classList.remove("disabled");
            emailReady=true;
        }else{
            element.classList.remove("green");
            element.classList.add("red");
            document.querySelectorAll(".popupelementtablebuttons")[2].classList.add("disabled");
            emailReady=false;
        }
    }

    function cancelPopups() {
        let node = document.querySelectorAll(".popupelementstablebox");
        for (let i = 0; i < node.length; i++) {
            node[i].classList.remove("red");
            node[i].classList.remove("green");
        }
        document.getElementById("popuppassword").setAttribute("hidden","hidden");
        document.getElementById('oldPswd').value = "";
        document.getElementById('newPswd').value = "";
        document.getElementById('XCkPswd').value = "";
        pswdReady = false;
        document.querySelectorAll(".popupelementtablebuttons")[0].classList.add("disabled");
        emailReady = false;
        document.getElementById("popupgetnewpassword").setAttribute("hidden","hidden");
        document.getElementById('email').value = "";
    }

    //LOGIN
    function login(){
        var user = document.getElementById('user').value;
        var password = document.getElementById('pwd').value;
        var data = JSON.stringify({"user": user, "password": password});
        postAjax(window.location.origin + "/ClientCredits/fidelity/ws/login.php",
            data,
            function(data){
                response = JSON.parse(data);
                console.log(response)

                currentPassword = password

                userid = response.userid;
                sessionId = response.sessionId;
                loggedIn = true;
                role = response.role;
                response.user = user;
                if(role){
                    updateAdminHomeUI(response.userid, response.email, response.name);
                    showAdminhome(response);
                }else{
                    updateClientHomeUI(response.userid, response.email, response.name);
                    showClientTransactions(response);
                }
                //getAllCards();
                //showSnackBar("Login Ok");
            },
            function(error){
            }
        )
    }   

    function showModal(title, msg)
    {
        $('#myModal .modal-title').text(title);
        $('#myModal .modal-body').text(msg);
        $("#myModal").modal();
    }
    //LOGOUT
    function logout(){
        var data = JSON.stringify({"sessionId": sessionId});
        postAjax(window.location.origin + "/ClientCredits/fidelity/ws/logout.php",data,
            function(data){
                sessionId = null;
                loggedIn = false;
                showLogin();
            },
            function(error){
                showSnackBar(error);
            }
        )
    }

    //LOAD CARD
    function getCardInfo(){
        postAjax(window.location.origin + "/ClientCredits/fidelity/ws/getCardInfo.php",'',
        function(data){
            let container = document.querySelector('#newsposts');
            let strNews = '<div class="titlestylefirst">News<br></div>';

            let response=JSON.parse(data);
            for(let i = 0; i < response.length; i++) {
                let newsObj = response[i];

                let strDnld ='';
                let files = newsObj.files;
                if(Array.isArray(files)){
                    //strDnld = '<div class="showdownloadfiles" onclick="toggleAttached(this)">mostra allegati</div><div class="downloadbox" hidden="hidden">';

                    strDnld = '<div class="showdownloadfiles" onclick="toggleAttached(this)">'+
                                '<div class="arrowicon"></div>'+
                                '<div class="showdownloadfilestext" >mostra allegati</div>'+
                              '</div>'+
                              '<div id="downloadfiles" hidden="hidden">';

                    files.forEach(file => {
                        strDnld +=  '<div class="downloadfilebox">'+
                                        '<a href="'+file.path+'" class="downloadfiletext" download>'+file.file+'</a>'+
                                        '<div class="pdficon"></div></div>';
                    });
                    strDnld += '</div>';
                };

                strNews +=  '<div id="'+newsObj.id+'" class="newspost '+(i?"newspostsmargin":"")+'">'+
                                '<div class="newstitle">'+newsObj.title+'</div>'+
                                '<div class="newsauthorbox">'+
                                    '<div class="newsauthor">'+newsObj.createdBy+'<br></div>'+
                                    '<div class="newsdate">'+newsObj.newsDate+'<br></div>'+
                                '</div>'+
                                '<div class="newsintroparagraph">'+newsObj.msg+'</div>'+
                                strDnld+
                            '</div>';
            }
            container.innerHTML = strNews;

        },
        function(error){

        });
    }
    function formatNumber(num)
    {
        var str = "" + num
        var pad = "0000"
        var ans = pad.substring(0, pad.length - str.length) + str
        return ans;
    }
    //LOAD CARDS
    function getAllCards(){
        var data = JSON.stringify({"sessionId": sessionId});
        postAjax(window.location.origin + "/ClientCredits/fidelity/ws/getAllCards.php",data,
        function(data){
            //let container = document.querySelector('#newsposts');
            let strCards = '';

            let response=JSON.parse(data);
            let card_count=response.card_count;
            response=response.data;
            console.log(response)
            var tot_credits = 0;
            for(let i = 0; i < response.length; i++) {
                let card = response[i];
                tot_credits += Number(card.amount);
                var amount = 0;

                var type_col = '';
                if(card.amount != null)
                {
                    amount = card.amount;
                    if(card.transaction_type == 1)
                        type_col = '<div class="amountstatusminus"></div>';
                    else if(card.transaction_type == 2)
                        type_col = '<div class="amountstatusplus"></div>';
                    else
                        type_col = '<div class="amountstatusbuy"></div>';
                }
                else 
                    type_col = '<div class="amountstatusnew"></div>';



                strCards +=  '<div class="historyvaluerow" cardid="' + card.id +
                 '" username="' + card.full_name +
                 '" email="' + card.email + 
                 '" amount="' + amount + 
                 '" user_id="' + card.user_id + '">'+
                                '<div class="datevalue">' + card.created_at + '</div>'+
                                '<div class="cardidvalue">'+formatNumber(card.id)+'</div>'+
                                '<div class="amountvaluebox">'+
                                    '<div class="valuestatusbox">' +
                                        type_col +
                                    '</div>' +
                                    '<div class="amountvalue">' + amount + '</div>'+
                                '</div>'+
                            '</div>';

                            // <div class="datevalue">24/6/2020, 14:15</div>
                            // <div class="cardidvalue">265</div>
                            // <div class="amountvaluebox">
                            //     <div class="valuestatusbox">
                            //         <div class="amountstatusplus" hidden></div>
                            //         <div class="amountstatusminus"></div>
                            //         <div class="amountstatusbuy"hidden></div>
                            //     </div>
                            //     <div class="amountvalue">3</div>
                            // </div>


            }
            document.getElementById("fidelityadminhome").querySelector(".appcontainer .inputcontainer .historycontainer").innerHTML = strCards;
            $('#admin-cnt-cards').text(card_count)
            $('#admin-tot-credits ').text(tot_credits)
            $('#fidelityadminhome .historyvaluerow').click(function(){
                var user_id = $(this).attr('user_id');
                var card_id = $(this).attr('cardid');
                var username = $(this).attr('username');
                var email = $(this).attr('email');
                var amount = $(this).attr('amount');

                updateAdminClientUI(user_id, card_id, username, email);
                showAdminclientTransactions();
            })
        },
        function(error){

        });
    }

    function retrievePassword(email){
        let data={email:email}

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/retrieveUserPassword.php",
            data,
            function(res, status){
                if(res == 'success'){
                    showModal("Success", "New password has been sent to email!");
                }else{
                    showModal('Failed', res)
                }
            })
    }


    function getTransactions(card_id){
        let data = {card_id:card_id};

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/getTransactions.php",
            data,
            function(res, status){

                if(status == 'success')
                {
                    console.log(res)
                    let strTransactions = '';
                    var result = $.parseJSON(res);

                    var credits = 0;
                    for(let i = 0; i < result.length; i++) {
                        var item = result[i];
                        var type_col = '';
                        credits += Number(item.delta);

                        if(item.transaction_type == 1)
                            type_col = '<div class="amountstatusminus"></div>';
                        else if(item.transaction_type == 2)
                            type_col = '<div class="amountstatusplus"></div>';
                        else
                            type_col = '<div class="amountstatusbuy"></div>';

                        strTransactions += '<div class="historyvaluerow" transaction_id="' + item.id + '">' +
                            '<div class="datevalue">' + item.date + '</div>' +
                            '<div class="cardidvalue">' + formatNumber(card_id) + '</div>' +
                            '<div class="amountvaluebox">' +
                                '<div class="valuestatusbox">' +
                                    type_col +
                                '</div>' +
                                '<div class="amountvalue">' + item.delta + '</div>' +
                            '</div>' +
                        '</div>';
                    }
                    $('#fidelityadminclient .historycontainer').html(strTransactions);
                    $('#fidelityadminclient .accountcontainer .accountid').text(credits);

                }
                else
                {
                    showModal("Error", res);
                }
            });
    }

    function getUserTransactions(user_id){
        let data = {user_id:user_id};

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/getTransactions.php",
            data,
            function(res, status){

                if(status == 'success')
                {
                    console.log(res)
                    let strTransactions = '';
                    var result = $.parseJSON(res);

                    var total_credits = 0;
                    for(let i = 0; i < result.length; i++) {
                        var item = result[i];
                        var type_col = '';
                        total_credits += Number(item.delta);

                        if(i == 0)
                        {
                            if(item.transaction_type == 1){
                                $('#fidelityclient .clientstatusvalueicondown').show();
                                $('#fidelityclient .clientstatusvalueiconup').hide();
                            }else{
                                $('#fidelityclient .clientstatusvalueicondown').hide();
                                $('#fidelityclient .clientstatusvalueiconup').show();
                            }
                        }

                        if(item.transaction_type == 1)
                            type_col = '<div class="amountstatusminus"></div>';
                        else if(item.transaction_type == 2)
                            type_col = '<div class="amountstatusplus"></div>';
                        else
                            type_col = '<div class="amountstatusbuy"></div>';

                        strTransactions += 
                        '<div class="historyvaluerow">' +
                            '<div class="datevalue">' + item.date + '</div>' +
                            '<div class="cardidvalue">' + formatNumber(item.card_id) + '</div>' +
                            '<div class="valuestatusbox">' +
                                type_col +
                            '</div>' +
                            '<div class="amountvalue">' + item.delta + '</div>' +
                        '</div>';
                    }
                    $('#fidelityclient .historycontainer').html(strTransactions);
                    $('#fidelityclient .clientstatusvalue').text(total_credits);
                }
                else
                {
                    showModal("Error", res);
                }
            });
    }



    function saveAddedTransactions(cardid)
    {
        var cnt = 0;
        var bufferdata = [];

        $('#fidelityadminclient .historycontainer .bufferitem').each(function(){
            cnt++;
            var transaction_type = $(this).attr('transaction_type');
            var amount = $(this).find('.amountvalue').text();
            var date = $(this).find('.datevalue').text();
            bufferdata.push({card_id:cardid, transaction_type:transaction_type, amount:amount, date:date})

            if(cnt == $('#fidelityadminclient .historycontainer .bufferitem').length){
                var data = {data: bufferdata}
                $.post(window.location.origin + "/ClientCredits/fidelity/ws/addTransactions.php",
                data,
                function(res, status){

                    if(status == 'success')
                    {
                        getTransactions(cardid);
                    }
                    else
                    {
                        showModal("Error", res);
                    }
                });
            }
        })
    }

    function deleteTransaction(transaction_id)
    {
        let data = {transaction_id: transaction_id};

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/deleteTransaction.php",
            data,
            function(response, status){
                if(response == 'success')
                {
                    var cardid = $('#fidelityadminclient .save').attr('cardid');
                    getTransactions(cardid);
                }else
                {
                    showModal("Error", response)
                }
            });
    }

    function prependTransactionsTable(transaction_type)
    {

        var credit_amount = $('#credit-amount').val();
        $('#credit-amount').val('');
        var container = $('#fidelityadminclient .historycontainer');
        var d = new Date();
        if(credit_amount != 0)
        {
            var type_col = '';
            if(transaction_type == 1){
                credit_amount = -credit_amount;
                type_col = '<div class="amountstatusminus"></div>';
            }
            else if(transaction_type == 2)
                type_col = '<div class="amountstatusplus"></div>';
            else
                type_col = '<div class="amountstatusbuy"></div>';

            var date = new Date();

            var card_id = $('#fidelityadminclient .save').attr("cardid");

            var item = '<div class="historyvaluerow bufferitem" transaction_type="' + transaction_type + '">' +
                            '<div class="datevalue">' + FormatDateMonth(d.getDate()) + '/' + FormatDateMonth(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + '</div>' +
                            '<div class="cardidvalue">' + formatNumber(card_id) + '</div>' +
                            '<div class="amountvaluebox">' +
                                '<div class="valuestatusbox">' +
                                    type_col +
                                '</div>' +
                                '<div class="amountvalue">' + Number(credit_amount) + '</div>' +
                            '</div>' +
                        '</div>';
            container.prepend(item);
        }else{
            alert('Can not input zero value!');
        }
    }

    function FormatDateMonth(num)
    {
        if(num < 10)
            return '0' + num;
        else
            return num;
    }

    function updateAdminAccountUI(userid, username, email)
    {
        $('#fidelityadminaccount .useraddress').text(email);
        $('#admin-account-email').val(email);
        $('#admin-account-username').val(username);
        $('#admin-account-password').val(currentPassword);
        $('#fidelityadminaccount .save').attr('userid', userid);
    }

    function updateClientAccountUI(userid, username, email)
    {
        $('#fidelityclientaccount .usercontainer .useraddress').text(email);
        $('#client-account-email').val(email);
        $('#client-account-name').val(username);
        $('#fidelityclientaccount .save').attr('userid', userid);
    }

    function updateAdminClientUI(userid, cardid, username, email)
    {
        $('#fidelityadminclient .usercontainer .useraddress').text(email);
        $('#btn-show-client-account').attr('userid', userid);
        $('#btn-show-client-account').attr('email', email);
        $('#btn-show-client-account').attr('username', username);
        $('#fidelityadminclient .usercontainer1 .useraddress').text(username);
        $('#fidelityadminclient .save').attr('cardid', cardid);
        getTransactions(cardid);

    }

    function updateAdminClientAccountUI(userid, username, email)
    {
        $('#fidelityadminclientaccount .usercontainer .useraddress').text(email);
        $('#admin-client-account-email').val(email);
        $('#admin-client-account-name').val(username);
        $('#admin-client-account-save').attr('userid', userid);
    }

    function updateAdminHomeUI(userid, email, username)
    {
        $('#btn-admin-account').attr('userid', userid);
        $('#btn-admin-account').attr('username', username);
        $('#btn-admin-account').attr('email', email);
        $('#fidelityadminhome .useraddress').text(email);
    }

    function updateClientHomeUI(userid, email, username)
    {
        $('#btn-client-edit-account').attr('userid', userid);
        $('#btn-client-edit-account').attr('username', username);
        $('#btn-client-edit-account').attr('email', email);
        $('#fidelityclient .useraddress').text(email);
        $('#client-account-password').val(currentPassword);
        getUserTransactions(userid);
    }

    //CREATE CARD
    function createCard(email, fullname){
        let data = {email:email, fullname:fullname};

      $.post(window.location.origin + "/ClientCredits/fidelity/ws/createCard.php",
        data,
        function(res, status){
            if(res == 'success')
            {
                alert("Created a card!");
                showAdminhome();
            }
            else
            {
                showModal("Error", res);
            }
        });
    }

    function updateUser(userid, email, username, password='')
    {
        let data = {userid:userid, email:email, username:username, password:password};

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/editUser.php",
            data,
            function(res, status){
                if(res == 'success')
                {
                    alert("Updated a User!");
                    currentPassword = password
                    updateAdminHomeUI(data.userid, data.email, data.username)
                    showAdminhome();
                }
                else
                {
                    showModal("Error", res);
                }
            });
    }

    function updateClient(userid, email, username, password='')
    {
        let data = {userid:userid, email:email, username:username, password:password};

        $.post(window.location.origin + "/ClientCredits/fidelity/ws/editUser.php",
            data,
            function(res, status){
                if(res == 'success')
                {
                    alert("Updated a User!");
                    currentPassword = password;
                    updateClientHomeUI(data.userid, data.email, data.username)
                    showClientTransactions();
                }
                else
                {
                    showModal("Error", res);
                }
            });
    }


    function showAdminaccount() {
        hideAll();

        document.getElementById("fidelityadminaccount").removeAttribute("hidden");
    }

    function showClientAccount() {
        hideAll();

        $('#fidelityclientaccount').removeAttr('hidden');
    }

    function showAdminhome(data='') {
        $('#cards_search_filter').val('');
        hideAll();
        document.getElementById("fidelityadminhome").removeAttribute("hidden");
        if(data != '')
        {
            document.getElementById("fidelityclient").querySelector(".appcontainer .titlecontainer .usercontainer .useraddress").innerText = data.user;
        }
        getAllCards();
    }

    function showRetrievePassword() {
        hideAll();
        document.getElementById("fidelityretrievepassword").removeAttribute("hidden");

    }

    function showLogin() {
        hideAll();
        document.getElementById("fidelitylogin").removeAttribute("hidden");
    }

    function showAdminclientTransactions() {
        hideAll();
        document.getElementById("fidelityadminclient").removeAttribute("hidden");
    }

    function showAdminclientAccount() {
        hideAll();
        document.getElementById("fidelityadminclientaccount").removeAttribute("hidden");
    }

    function showClientTransactions(data) {
        hideAll();
        document.getElementById("fidelityclient").removeAttribute("hidden");
        document.getElementById("fidelityclient").querySelector(".appcontainer .titlecontainer .usercontainer .useraddress").innerText = data.user;
    }

    function showCreateCard() {
        hideAll();
        $('#admin-clientemail').val('')
        $('#admin-clientname').val('')
        $('#fidelityadmincreatecard').removeAttr("hidden");
    }

    function hideAll() {

        document.getElementById("fidelityadminaccount").setAttribute("hidden","hidden");
        document.getElementById("fidelityretrievepassword").setAttribute("hidden","hidden");
        document.getElementById("fidelityadminhome").setAttribute("hidden","hidden");
        document.getElementById("fidelitylogin").setAttribute("hidden","hidden");
        document.getElementById("fidelityclient").setAttribute("hidden","hidden");
        document.getElementById("fidelityadminclient").setAttribute("hidden","hidden");
        document.getElementById("fidelityclientaccount").setAttribute("hidden","hidden");
        document.getElementById("fidelityadminclientaccount").setAttribute("hidden","hidden");
        document.getElementById("fidelityadmincreatecard").setAttribute("hidden","hidden");
    }

});