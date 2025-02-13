var catelog = document.querySelector("#catelog");
        function getProducts(url) {
            fetch(url)
            .then(function(responce){
                return responce.json();
            })
            .then(function(data){
            for(item of data)
            {
                var card = document.createElement("div");
                card.className = "card p-2 border-0 main-card products-card";
                card.style.minWidth = "250px";
                card.style.width = "200px";
                card.innerHTML = `
                    <div class="d-flex justify-content-between">
                        <div class="card-circle"></div>
                        <div class="card-circle"></div>
                    </div>    
                    <img loading="lazy" class="card-img-top" src="${item.image}" alt="Card image cap" style="height: 200px">
                    <div class="card-header overflow-hidden mt-2 text-truncate"><span class="productdetails">Title: </span>${item.title}</div>
                    <div class="card-body w-100 ">
                        <dl>
                            <dd class="card-text"><span class="productdetails">Price:</span> &#8377;${item.price}</dd>
                            <dd><span class="productdetails">Rating:</span> ${item.rating.rate} <span class="bi bi-star-fill" style="color: yellow"><span class="bi bi-star-fill"><span class="bi bi-star-fill"></span><span class="bi bi-star-half"></dd>
                            <dd><span class="productdetails">Buyers:</span> ${item.rating.count} <span class="bi bi-person-fill" style="color: blue"><span></dd>
                        </dl>
                    </div>
                    <div class="card-footer">
                        <button onclick="addToCart(${item.id});" id="submitbtn-${item.id}" class="btn btn-success w-100"><span class="bi bi-cart-plus"></span> Add to cart</button>
                        <button id="Item-In-Cart-${item.id}" class=" d-none" data-bs-toggle="modal" data-bs-target="#cart"><span class="bi bi-cart-check-fill"></span> Item In Cart</button>
                    </div>`;    
                    
                    catelog.appendChild(card);
            }
            })
        }

        function getCategory() {
            fetch("https://fakestoreapi.com/products/categories").then(function(responce){
                return responce.json();
            })
            .then(function(categories){
                categories.unshift("ALL");
                for (var name of categories)
            {
                const option = document.createElement("option");
                option.className = "bg-white";
                option.text = name.toUpperCase();
                option.value = name;
                document.querySelector("select").appendChild(option);
            }
            })
        }

        function bodyload() {
            getCategory();
            getProducts("https://fakestoreapi.com/products");
            realTimeClock();
            document.addEventListener("DOMContentLoaded", function () {
            var savedOrders = localStorage.getItem("PlacedOrder");
                if (savedOrders) {
                    PlacedOrder = JSON.parse(savedOrders);
                }
            });

        }

        function selectedCategory() {
            catelog.innerHTML = "";
            var category = document.querySelector("select").value;
            if(category == "ALL") {
                getProducts("https://fakestoreapi.com/products");
            }
            else {
                getProducts(`https://fakestoreapi.com/products/category/${category}`);
            }
        }

        var cardItem = [];
        var counter = document.getElementById("itemcounter");
        counter.innerHTML = 0;

        function addToCart(id) {
            
            if(!cardItem.includes(id)) {
                cardItem.push(id);
                alert("Item Added to cart ");
                counter.innerHTML = cardItem.length;
                var btn = document.getElementById(`submitbtn-${id}`);
                var btn2 = document.getElementById(`Item-In-Cart-${id}`);
                if(btn) {
                    btn.style.display = "none";
                    btn2.classList.remove("d-none");
                    btn2.className = "btn btn-primary w-100";
                }
            }
            displayCartItems();
        }

        function displayCartItems() {
            if(cardItem.length > 0) {
                var displayItems = document.getElementById("content");
                displayItems.innerHTML = "";
                for( var id of cardItem) {
                    fetch(`https://fakestoreapi.com/products/${id}`)
                    .then(function(responce){
                        return responce.json();
                    })
                    .then(function(item){
                        var table = document.createElement("table");
                        table.style.width = "100%";
                        table.className = "table table-hover"
                        table.innerHTML = `
                            <thead>
                                <tr>
                                    <th class="w-50">Product Name</th>
                                    <th class="w-25">Price</th>
                                    <th class="text-center w-25">Preview</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="w-50">
                                    <div class="d-flex flex-column gap-5">
                                        <div class="overflow-hidden" style="height: 50px">
                                        ${item.title}
                                        </div>     
                                        <div class="d-flex gap-3">
                                            <button id="orderplacedbtn-${item.id}" onclick="displayPacedOrders()" class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#finalOrder">Order Placed</button>
                                            <button id="confirmOrderbtn-${item.id}"  onclick="confirmOrder(${item.id})" class="btn btn-success">Order <span class="bi bi-cart"></span></button>
                                            <button id="removeOrderBtn-${item.id}" onclick="removeCartItem(${item.id})" class="btn btn-danger">Remove <span class="bi bi-trash"></span></button>
                                        </div>    
                                    </div>
                                    </td>
                                    <td class="w-25 align-content-start">&#8377;${item.price}</td>
                                    <td class="w-25 text-center" onclick="previewItems(${item.id})" data-bs-toggle="modal" data-bs-target="#cartpreview"><img class="card-img-top" src="${item.image}" height="100px" width="100px"></td>         
                                </tr>
                            </tbody> `      
                        displayItems.appendChild(table);
                    })
                }
            } else {
                var displayItems = document.getElementById("content");
                displayItems.innerHTML = "<p class='text-center fs-4'>No items in cart <i class='bi bi-emoji-smile-upside-down-fill'></i></p>";
            }
        }
        function removeCartItem(id) {
            cardItem = cardItem.filter(function(item) {
                return item!= id;
            });
            counter.innerHTML = cardItem.length;
            alert("Item removed from cart");
            var btn = document.getElementById(`submitbtn-${id}`);
            var btn2 = document.getElementById(`Item-In-Cart-${id}`);
            if(btn) {
                btn.style.display = "block";
                btn2.classList.add("d-none");
            }
            displayCartItems();
        }

        function previewItems(id) {
            fetch(`https://fakestoreapi.com/products/${id}`)
                .then(function(responce){
                    return responce.json();
                })
                .then(function(item){
                    var productdetails = document.getElementById("productdetail");
                    productdetails.innerHTML = `
                        <div class="card p-2">
                            <div class="bg-white">
                                <img loading="lazy" src="${item.image}" width="150px" height="300px" class="card-img-top p-2">
                                <div class="card-header overflow-hidden" style="height: 50px;"><span class="fw-bold">Title:</span> ${item.title}</div>     
                            </div>    
                            <div class="card-body">
                                <div><span class="fw-bold">Price:</span> &#8377;${item.price}</div>
                                <div><span class="fw-bold">Ratings:</span> ${item.rating.rate} <span class="bi bi-star-fill" style="color: yellow"><span class="bi bi-star-fill"><span class="bi bi-star-fill"></span><span class="bi bi-star-half"></div>
                                <div><span class="fw-bold">Buyers:</span> ${item.rating.count} <span class="bi bi-person-fill" style="color: blue"><span></div>
                                
                            </div>
                            <div class="card-footer">
                                <div class="fw-bold">Description:</div>
                                <p>${item.description}</p>
                            </div>    
                        </div> `;   
                })
        }

        var userDetails = {
                name: "",
                email: "",
                password: ""
            }

        function userProfileDetails() {
            document.getElementById("dropdown").style.display = "none";
                document.getElementById("userProfilebtn").style.display = "flex";
                document.getElementById("userBodyDetails").innerHTML = `
                    <dl>
                        <dt class="text-success" style="font-size: 14px">Your Name </dt>
                        <dd>${userDetails.name}</dd>
                        <dt class="text-success" style="font-size: 14px">Your Email</dt>
                        <dd>${userDetails.email}</dd>
                        <dt><button id="addPopupAddress" onclick="addPopupAddress()" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddress">Add Address</button></dt>
                        <dt id="userAddressNAme" class="text-success d-none" style="font-size: 14px">Your Address</dt>
                        <dd id="userAddress" class="d-none"></dd>
                    </dl>
                    `;
                document.getElementById("userNameonhomepage").innerHTML = `Hello ${userDetails.name}`;    
        }
        function registerSubmit() {

            var userName = document.getElementById("name").value;
                const preUserName =  `${userName.charAt(0).toUpperCase()}`;
                const postUserName = `${userName.substring(1).toLowerCase()}`;
                const finalUserName = preUserName + postUserName;
                const userEmail = document.getElementById("regemail").value;
                const userPassword = document.getElementById("regpassword").value;
                const regenterpassword = document.getElementById("regenterpassword").value;

                profileLogoDetails();

                if(userName && userEmail && userPassword) {
                    if(userPassword !== regenterpassword) {
                        alert("Both Passwords are not matching");
                        return;
                    } else{
                        userDetails.name = finalUserName;
                        userDetails.email = userEmail;
                        userDetails.password = userPassword;
                    }
                } else{
                    alert("Please fill all fields");
                    return;
                }

                userProfileDetails();
            }

            var loginUser = {username: "Harsh", email: "Harsh@gmail.com", password: "Harsh143"}
                
            function loginSubmit() {

                const userName = document.getElementById("loginname").value.trim();
                const userEmail = document.getElementById("loginemail").value.trim();
                const userPassword = document.getElementById("loginpassword").value.trim();

                if(userName && userEmail && userPassword) {
                    if(loginUser.username === userName && loginUser.email === userEmail && loginUser.password === userPassword) {
                        userDetails.name = userName;
                        userDetails.email = userEmail;
                        userDetails.password = userPassword;
                        alert("Login successful ✅")
                    } else {
                        alert("❌ Invalid Username / Email / Password ");
                        return;
                    }
                } else {
                    alert("Please fill all fields");
                    return;
                }
                profileLogoDetails();
                userProfileDetails();
            }

            function profileLogoDetails() {
                document.getElementById("profilelogoview").innerHTML = `
                    <div onmouseover="hoverEffect(this)" onmouseout="removeEffect(this)" class="text-center d-flex flex-column justify-content-center align-items-center mt-2 mb-2 userProfilelogo">
                                    
                                </div>`;
            }
            function hoverEffect(element) {
                element.style.background = "lightgray";
                element.innerHTML = `
                        <span class="bi bi-camera" style="font-size: 30px;"></span>
                        <div>Edit Pic</div>
                    `;  
            }

            function removeEffect(element) {
                element.style.background = "url('./data/1000190458.jpg')";
                profileLogoDetails();
            }

            function logoutUser() {
                document.getElementById("dropdown").style.display = "flex";
                document.getElementById("userProfilebtn").style.display = "none";
                document.getElementById("userBodyDetails").innerHTML = "";
                document.getElementById("userNameonhomepage").innerHTML = "";
            }

            function time() {
                var clock = new Date();
                document.getElementById("clocktime").innerHTML = clock.toLocaleTimeString();
            }

            function realTimeClock() {
                setInterval(time, 1000);
            }

            var userAddress = {
                address: "",
                city: "",
                state: "",
                zipcode: "",
                phonenumber: ""
            }

            function addAddress() {

                var address = document.getElementById("address").value;
                var city = document.getElementById("city").value;
                var state = document.getElementById("state").value;
                var zipcode = document.getElementById("zipcode").value;
                var phonenumber = document.getElementById("phonenumber").value;
                var addressPopupBtn = document.getElementById("addPopupAddress");

                userAddress.address = address;
                userAddress.city = city;
                userAddress.state = state;
                userAddress.zipcode = zipcode;
                userAddress.phonenumber = phonenumber;

                document.getElementById("userAddress").classList.remove("d-none");
                document.getElementById("userAddressNAme").classList.remove("d-none");
                addressPopupBtn.classList.add("d-none");
                document.getElementById("userAddress").innerHTML = `
                    <dl>
                        <dd class="d-flex justify-content-between w-100">
                            <div class="w-50 text-start"><span class="text-primary ">Address: </span> ${userAddress.address}</div>
                            <div class="w-50 text-start"><span class="text-primary ">City: </span>${userAddress.city}</div>
                        </dd>     
                        <dd class="d-flex justify-content-between w-100">
                            <div class="w-50 text-start"><span class="text-primary ">State: </span> ${userAddress.state}</div>
                            <div class="w-50 text-start"><span class="text-primary ">zip code: </span> ${userAddress.zipcode}</div>
                        </dd>
                        <dd class="d-flex justify-content-between w-100">
                            <div class="w-50 text-start"><span class="text-primary ">Phone No: </span> ${userAddress.phonenumber}</div>
                        </dd>
                    </dl>`;
            }

            var PlacedOrder = [];

            function confirmOrder(id) {
                if (!PlacedOrder.includes(id)) {
                    PlacedOrder.push(id);
                    localStorage.setItem("PlacedOrder", JSON.stringify(PlacedOrder)); 

                    var confirmOrderbtn = document.getElementById(`confirmOrderbtn-${id}`);
                    var orderplacedbtn = document.getElementById(`orderplacedbtn-${id}`);

                    if (confirmOrderbtn && orderplacedbtn) {
                        confirmOrderbtn.style.display = "none";
                        orderplacedbtn.classList.remove("d-none");
                    }
                }
            }

            

            function displayPacedOrders() {
                var finalOrder = document.getElementById("finalOrderPreview");
                finalOrder.innerHTML = "";
                for(var productID of PlacedOrder) {
                    fetch(`https://fakestoreapi.com/products/${productID}`)
                    .then(function(responce){
                        return responce.json();
                    })
                    .then(function(product) {
                        finalOrder.innerHTML += `
                                <div class="card mb-4 shadow-sm">
                                    <div class="card-header">
                                        <h4 class="my-0 font-weight-normal">${product.title}</h4>
                                    </div>
                                    <div class="card-body">
                                        <img src="${product.image}" class="card-img-top" alt="...">
                                        <ul class="list-group list-group-flush">
                                            <li class="list-group-item">Price: ${product.price}</li>
                                            <li class="list-group-item">Description: ${product.description}</li>
                                        </ul>
                                        <button id="removeOrderbtn-${product.id}" onclick="removeOrder(${product.id})" class="btn btn-primary">Remove</button>
                                    </div>
                                </div>`;
                    })
                }  
            }      