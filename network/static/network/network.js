document.addEventListener("DOMContentLoaded", function() {

    const all_posts_div = document.querySelector("#all-posts");
    const new_post_form = document.querySelector("#new-post");
    const user_profile_div = document.querySelector("#user-profile-view");
    const navigation_div = document.querySelector("#navigation");
    const follow_div = document.querySelector("#follow")
    follow_div.style.display = "none";
    new_post_form.style.display = "none";
    all_posts_div.style.display = "none";
    user_profile_div.style.display = "none";
    navigation_div.style.display = "none";

    document.querySelector("#create-new-post").onclick = (event) =>{
        event.preventDefault();
        new_post_form.style.display = "block";

    }

    all_posts_div.addEventListener("click", function(event) {
        if (event.target.classList.contains("user-profile")) {
            event.preventDefault();
            follow_div.innerHTML = ""
            follow_div.style.display = "block"
            all_posts_div.style.display = "none";
            navigation_div.style.display = "none";
            user_profile_div.style.display = "block";
            const username = event.target.textContent;
            fetch(`show_user/${username}`)
            .then(response => response.json())
            .then(user =>{
                localStorage.setItem("profile_user", user.username)
                const profile_info = document.querySelector("#profile-info")
                profile_info.innerHTML = ""
                const profile_name = document.createElement("h1");
                profile_name.textContent = `${user.username}'s Profile`;
                profile_info.append(profile_name);
                const followers = document.createElement("h3");
                followers.textContent = `Followers: ${user.followers.length}`;
                profile_info.append(followers);
                const following = document.createElement("h3");
                following.textContent = `Following: ${user.following.length}`;
                profile_info.append(following);
                localStorage.setItem("followers", user.followers);
                
                return fetch('get_username');
            })

            .then(response => response.json())
            .then(data => {
                const followers = localStorage.getItem("followers");
                const this_user = data.username;

                if (this_user !== username){

                    follow_div.innerHTML = ""
                    const follow_button = document.createElement("button");
                    follow_button.setAttribute("id", "follow-btn");
                    if (!followers.includes(this_user)){
                        follow_button.textContent = "Follow"
                    } else {
                        follow_button.textContent = "Unfollow"
                    }
                    
                    follow_div.append(follow_button)
                }
                
            });

            show_posts(username, "user", 1)
        }
    });

    document.querySelector("#show-all-posts").onclick = (event) => {
        event.preventDefault();
        show_posts("all", "all", 1)
    }
    
    document.body.addEventListener("click", function(event) {
        if (event.target.id === "follow-btn") {

           const username = localStorage.getItem("profile_user")

            fetch(`follow_user/${username}`, {
                method: "PUT",
                body: JSON.stringify({
                    follow_change: true 
                })
            })
            .then(response => response.json())
            .then(data =>{
                const follow_div = document.querySelector("#follow")
                follow_div.innerHTML =""
                follow_div.textContent = data.message
            })
        }

    })

    document.querySelector("#new-post-form").onsubmit = function(event) {
        event.preventDefault();
        fetch("/new_post", {
            method: "POST",
            body: JSON.stringify({
                text: this.querySelector('textarea[name="text"]').value
            })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
        });
        this.reset()
    }

    document.querySelector("#show-following-posts").onclick = function(event) {
        event.preventDefault()
        const username = document.querySelector("#username").textContent

        show_posts(username, "following", 1)        
    }

    function navigation(username, posts_to_show, page_number, last_page) {
        navigation_div.style.display = "block"
        navigation_div.innerHTML = ""
        const nav_el = document.createElement("nav");
        nav_el.setAttribute("aria-label", "Page navigation");
        const ul_el = document.createElement("ul");
        ul_el.classList.add("pagination")
        
        if (page_number !==1) {
            const li_el_p = document.createElement("li")
            li_el_p.classList.add("page-item")
            const a_el_p = document.createElement("a")
            a_el_p.classList.add("page-link")
            a_el_p.href = "#"
            a_el_p.setAttribute("id", "previous-page")
            a_el_p.textContent = "Previous"
            li_el_p.append(a_el_p)
            ul_el.append(li_el_p)

        }

        if (page_number !==last_page) {
            const li_el_n = document.createElement("li")
            li_el_n.classList.add("page-item")
            const a_el_n = document.createElement("a")
            a_el_n.classList.add("page-link")
            a_el_n.href = "#"
            a_el_n.setAttribute("id", "next-page")
            a_el_n.textContent = "Next"
            li_el_n.append(a_el_n)
            ul_el.append(li_el_n)

        }      
                
        navigation_div.append(ul_el)

        localStorage.setItem("current_page", page_number)
        localStorage.setItem("current_user_show_posts", username)
        localStorage.setItem("posts_to_show", posts_to_show)

    }


    function show_posts(username, posts_to_show, page_number) {
        const active_user = document.querySelector("#username").textContent
        if (posts_to_show !== "user") {
            user_profile_div.style.display = "none";
        }    
        all_posts_div.innerHTML = ""
        all_posts_div.style.display = "block"
        fetch(`show_posts/${username}/${posts_to_show}/${page_number}`)
        .then(response => response.json())
        .then(data => {
            data.posts.forEach((post) =>{
                const div_element = document.createElement("div");
                div_element.style.border = '1px solid black'
                div_element.style.margin = '2px'
                div_element.style.textAlign = 'center'
                const userProfileLink = document.createElement("a");
                userProfileLink.href = "#";  
                userProfileLink.classList.add("user-profile");
                userProfileLink.textContent = post.user;

                const likes_link = document.createElement("a");
                likes_link.href = "#";
                if (post.liked_usernames.includes(active_user)) {
                    likes_link.textContent = "Unlike";
                } else {
                    likes_link.textContent = "Like";
                }

                likes_link.classList.add("like-link");
                likes_link.style.margin = "5px";

                const total_like_div = document.createElement("div");
                total_like_div.classList.add("total-likes")
                total_like_div.innerHTML = `${post.likes} user(s) liked this post!`

                const like_div = document.createElement("div")
                like_div.appendChild(likes_link)
                like_div.appendChild(total_like_div)

                
                div_element.setAttribute("data-post-id", post.id);

                // Append user profile link and other content to the div
                div_element.appendChild(document.createTextNode("User: "));
                div_element.appendChild(userProfileLink);

                const post_text = document.createElement("div")
                post_text.innerHTML = ` ---- Content: ${post.text}, ---- Time: ${post.timestamp}`
                post_text.classList.add("post-text")
                div_element.appendChild(post_text);
                div_element.appendChild(like_div);


                if (active_user === post.user) {
                    const edit_link = document.createElement("a");
                    edit_link.href ="#";
                    edit_link.textContent = "Edit post";
                    edit_link.classList.add("edit-link")
                    div_element.appendChild(edit_link);
                }
                // Append the div to all_posts_div
                all_posts_div.appendChild(div_element);
            }
            )
            
            navigation(data.username, posts_to_show, data.page_number, data.last_page)
            
        });
    }
    
    document.body.addEventListener("click" , function(event) {
        if (event.target.classList.contains("page-link")) {
            const username= localStorage.getItem("current_user_show_posts")
            const posts_to_show= localStorage.getItem("posts_to_show")
            var current_page = localStorage.getItem("current_page")
            current_page  = parseInt(current_page, 10)
            event.preventDefault();
            if (event.target.id === "next-page") {
                page_number = current_page + 1
                show_posts(username, posts_to_show, page_number)
            } else if (event.target.id === "previous-page") {
                page_number = current_page - 1
                show_posts(username, posts_to_show, page_number)
            }

        }
    } )

    document.body.addEventListener("click", function (event){
        if (event.target.classList.contains("edit-link")) {
            const div_element = event.target.parentNode
            const edit_form = document.createElement("form")
            const textarea = document.createElement("textarea");

            textarea.setAttribute("name", "edited-content");
            textarea.setAttribute("rows", "4");
            textarea.setAttribute("cols", "50");

            const saveButton = document.createElement("input");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("value", "Save");
            saveButton.classList.add("save-edit");

            const cancelButton = document.createElement("input");
            cancelButton.setAttribute("type", "button");
            cancelButton.setAttribute("value", "Cancel");
            cancelButton.classList.add("cancel-edit");

            // Append the label, textarea, and submit button to the form

            edit_form.appendChild(textarea);
            edit_form.appendChild(saveButton);
            edit_form.appendChild(cancelButton);
            div_element.appendChild(edit_form)

        }
    })

    document.body.addEventListener("click", function(event) {
        if (event.target.classList.contains("save-edit")) {
            save_edit(event);
        } else if (event.target.classList.contains("cancel-edit")) {
            cancel_edit(event);
        }

    })

    document.body.addEventListener("click", function(event) {
    if (event.target.classList.contains("like-link")) {
        const div_element = event.target.parentNode.parentNode
        const post_id = div_element.getAttribute("data-post-id");
        fetch(`like/${post_id}`,{
            method: "PUT"
        })
            .then(response => response.json())
            .then((data)=>{
                const total_likes_div = div_element.querySelector(".total-likes")
                total_likes_div.innerHTML =`${data.likes} user(s) liked this post!`
                const like_link = div_element.querySelector(".like-link")
                if (like_link.textContent === "Like") {
                    like_link.textContent = "Unlike"
                } else {
                    like_link.textContent = "Like"
                }
            })
    }
    })

    function cancel_edit(event){
        const div_element = event.target.parentNode.parentNode;
        const edit_form = event.target.parentNode;
        div_element.removeChild(edit_form);
    }

    function save_edit(event){
        const edit_form = event.target.parentNode
        const new_text = edit_form.querySelector("textarea").value
        const div_element = event.target.parentNode.parentNode;
        const post_id = div_element.getAttribute("data-post-id");
        console.log(div_element)
        fetch(`edit_post/${post_id}`, {
            method:"PUT",
            body: JSON.stringify({
                text: new_text
            })
        })
        .then (response => response.json())
        .then(data => {
        div_element.removeChild(edit_form);
        const post_text = div_element.querySelector(".post-text")
        post_text.innerHTML = ` ---- Content: ${data.post.text}, ---- Time: ${data.post.timestamp}`

    })

    }



})