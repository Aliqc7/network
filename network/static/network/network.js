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
                
                // Attach click event listener to the user profile link

                // Append user profile link and other content to the div
                div_element.appendChild(document.createTextNode("User: "));
                div_element.appendChild(userProfileLink);
                div_element.appendChild(document.createTextNode(` ---- Content: ${post.text}, ---- Time: ${post.timestamp} --- Likes : 0`));

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

})