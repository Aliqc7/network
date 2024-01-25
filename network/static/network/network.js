document.addEventListener("DOMContentLoaded", function() {

    const all_posts_div = document.querySelector("#all-posts");
    const new_post_form = document.querySelector("#new-post");
    const user_profile_div = document.querySelector("#user-profile-view");
    new_post_form.style.display = "none";
    all_posts_div.style.display = "none";
    user_profile_div.style.display = "none";

    document.querySelector("#create-new-post").onclick = (event) =>{
        event.preventDefault();
        new_post_form.style.display = "block";

    }

    all_posts_div.addEventListener("click", function(event) {
        if (event.target.classList.contains("user-profile")) {
            event.preventDefault();
            all_posts_div.style.display = "none";
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
                    const follow_div = document.querySelector("#follow")
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

            fetch(`show_user_posts/${username}`)
            .then(response => response.json())
            .then(posts =>{
                const user_posts = document.querySelector("#user-posts");
                user_posts.innerHTML = ""
                posts.forEach((post) =>{
                    const div_element = document.createElement("div");
                    div_element.style.border = '1px solid black'
                    div_element.style.margin = '2px'
                    div_element.style.textAlign = 'center'
                    div_element.appendChild(document.createTextNode(`Content: ${post.text}, ---- Time: ${post.timestamp} --- Likes : 0`));
                    user_posts.append(div_element)
                    
                }

                )
            });

            

            

        }
    });


    document.querySelector("#show-all-posts").onclick = (event) =>{
        event.preventDefault();
        user_profile_div.style.display = "none";
        all_posts_div.innerHTML = ""
        all_posts_div.style.display = "block"
        fetch("/show_all_posts")
        .then(response => response.json())
        .then(posts => {
            posts.forEach((post) =>{
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
            
        });
    }

    document.body.addEventListener("click", function(event) {
        if (event.target.id === "follow-btn") {
            const profile_user = localStorage.getItem("profile_user")
            fetch(`follow_user/${profile_user}`, {
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

})