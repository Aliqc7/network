document.addEventListener("DOMContentLoaded", function() {

    const all_posts_div = document.querySelector("#all-posts");
    const new_post_form = document.querySelector("#new-post");
    const user_profile_div = document.querySelector("#user-profile-view");
    const navigation_div = document.querySelector("#navigation");
    const follow_div = document.querySelector("#follow")



    document.body.classList.add("container-fluid", "bg-light");

    follow_div.classList.add("container", "mb-3");
    new_post_form.classList.add("container", "mb-3");
    all_posts_div.classList.add("container", "mb-3");
    user_profile_div.classList.add("container", "mb-3");
    navigation_div.classList.add("container", "mb-3");

    follow_div.style.display = "none";
    new_post_form.style.display = "none";
    all_posts_div.style.display = "none";
    user_profile_div.style.display = "none";
    navigation_div.style.display = "none";

    document.querySelector("#show-all-posts").onclick = (event) => {
    event.preventDefault();
    new_post_form.style.display = "none";
    show_posts("all", "all", 1)
    };

    document.querySelector("#show-following-posts").onclick = function(event) {
        event.preventDefault()
        const username = document.querySelector("#username").textContent
        show_posts(username, "following", 1)
    }

    document.body.addEventListener("click", handlePageLinkClick);
    document.body.addEventListener("click", handleEditLinkClick);


    document.body.addEventListener("click", function (event) {
        if (event.target.classList.contains("save-edit")) {
            save_edit(event);
        } else if (event.target.classList.contains("cancel-edit")) {
            // alert("cancel button clicked!")
            cancel_edit(event);
        }
    });

    document.body.addEventListener("click", function (event) {
        handleLikeButtonClick(event);
        });


    document.querySelector("#create-new-post").onclick = (event) =>{
    event.preventDefault();
    new_post_form.style.display = "block";

    };

    document.querySelector("#new-post-form").onsubmit = handleNewPostFormSubmit;

    document.body.addEventListener("click", handleUserProfileClick);

    document.body.addEventListener("click", handleFollowButtonClick);

    function createPostElement(post) {
    const active_user = document.querySelector("#username").textContent;
    const div_element = document.createElement("div");
    div_element.classList.add("card", "m-2", "text-center", "border-dark");

    const userProfileLink = document.createElement("a");
    userProfileLink.href = "#";
    userProfileLink.classList.add("card-title", "user-profile", "font-weight-bold");
    userProfileLink.textContent = post.user;

    const likes_link = document.createElement("a");
    likes_link.href = "#";
    likes_link.classList.add("card-link", "like-link");
    likes_link.style.marginRight ="4px"

    if (post.liked_usernames.includes(active_user)) {
        likes_link.textContent = "Unlike";
    } else {
        likes_link.textContent = "Like";
    }

    const total_like_div = document.createElement("div");
    total_like_div.classList.add("total-likes");
    total_like_div.innerHTML = ` | ${post.likes} user(s) liked this post!`;

    const like_div = document.createElement("div");
    like_div.appendChild(likes_link);

    const footer_div = document.createElement("div");
    footer_div.appendChild(like_div)
    footer_div.appendChild(total_like_div)
    footer_div.classList.add("d-flex", "justify-content-center", "card-footer")

    div_element.setAttribute("data-post-id", post.id);

    const user_profile_div = document.createElement("div")
    user_profile_div.appendChild(userProfileLink)
    user_profile_div.appendChild(document.createTextNode(`${post.timestamp}`))
    user_profile_div.classList.add("d-flex", "justify-content-between")
    user_profile_div.style.padding = "15px"
    div_element.appendChild(user_profile_div);

    const post_text = document.createElement("div");
    post_text.innerHTML = post.text;
    post_text.style.fontSize = "26px"
    post_text.classList.add("card-text", "post-text");
    div_element.appendChild(post_text);
    div_element.appendChild(footer_div);

    if (active_user === post.user) {
        const edit_link = document.createElement("a");
        edit_link.href = "#";
        edit_link.textContent = "Edit post";
        edit_link.style.marginLeft = "10px"
        edit_link.classList.add("card-link", "edit-link");
        footer_div.appendChild(edit_link);
    }

    return div_element;
}
    function createNavigationElement(pageNumber, label) {
        const li_el = document.createElement("li");
        li_el.classList.add("page-item");

        const a_el = document.createElement("a");
        a_el.classList.add("page-link");
        a_el.href = "#";
        a_el.textContent = label;
        a_el.setAttribute("id", `${label.toLowerCase()}-page`);
        li_el.appendChild(a_el);

        return li_el;
    }

    function createNavigation(username, posts_to_show, page_number, last_page) {
        navigation_div.style.display = "block";
        navigation_div.innerHTML = "";
        const nav_el = document.createElement("nav");
        nav_el.setAttribute("aria-label", "Page navigation");
        const ul_el = document.createElement("ul");
        ul_el.classList.add("pagination");

        if (page_number !== 1) {
            const li_el_p = createNavigationElement(page_number - 1, "Previous");
            ul_el.append(li_el_p);
        }

        if (page_number !== last_page) {
            const li_el_n = createNavigationElement(page_number + 1, "Next");
            ul_el.append(li_el_n);
        }

        navigation_div.append(ul_el);

        localStorage.setItem("current_page", page_number);
        localStorage.setItem("current_user_show_posts", username);
        localStorage.setItem("posts_to_show", posts_to_show);
    }

    function show_posts(username, posts_to_show, page_number) {
        const active_user = document.querySelector("#username").textContent;
        if (posts_to_show !== "user") {
            user_profile_div.style.display = "none";
        }
        all_posts_div.innerHTML = ""
        all_posts_div.style.display = "block";
        fetch(`show_posts/${username}/${posts_to_show}/${page_number}`)
            .then(response => response.json())
            .then(data => {
                data.posts.forEach((post) => {
                    const div_element = createPostElement(post);
                    all_posts_div.appendChild(div_element);
                });

                createNavigation(data.username, posts_to_show, data.page_number, data.last_page);
            });
    }

    function handleUserProfileClick(event) {
    if (event.target.classList.contains("user-profile")) {
        event.preventDefault();
        follow_div.innerHTML = "";
        follow_div.style.display = "block";
        all_posts_div.style.display = "none";
        navigation_div.style.display = "none";
        user_profile_div.style.display = "block";
        const username = event.target.textContent;
        fetch(`show_user/${username}`)
            .then(response => response.json())
            .then(user => {
                localStorage.setItem("profile_user", user.username);
                const profile_info = document.querySelector("#profile-info");
                profile_info.innerHTML = "";
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

                if (this_user !== username) {
                    follow_div.innerHTML = "";
                    const follow_button = document.createElement("button");
                    follow_button.setAttribute("id", "follow-btn");
                    if (!followers.includes(this_user)) {
                        follow_button.textContent = "Follow";
                    } else {
                        follow_button.textContent = "Unfollow";
                    }

                    follow_div.append(follow_button);
                }
            });

        show_posts(username, "user", 1);
    }
}

    function cancel_edit(event) {
    const div_element = event.target.parentNode.parentNode;
    const edit_form = event.target.parentNode;
    div_element.removeChild(edit_form);
    }

    function save_edit(event) {
        const edit_form = event.target.parentNode;
        const new_text = edit_form.querySelector("textarea").value;
        const div_element = event.target.parentNode.parentNode;
        const post_id = div_element.getAttribute("data-post-id");

        fetch(`edit_post/${post_id}`, {
            method: "PUT",
            body: JSON.stringify({
                text: new_text
            })
        })
            .then(response => response.json())
            .then(data => {
                div_element.removeChild(edit_form);
                const post_text = div_element.querySelector(".post-text");
                post_text.innerHTML = ` ---- Content: ${data.post.text}, ---- Time: ${data.post.timestamp}`;
            });
    }

    function handleFollowButtonClick(event) {
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
                if (event.target.textContent === "Follow") {
                    event.target.textContent = "Unfollow"
                } else {
                    event.target.textContent = "Follow"
                }
            })
        }
    }

    function handlePageLinkClick(event) {
        if (event.target.classList.contains("page-link")) {
            const username = localStorage.getItem("current_user_show_posts");
            const posts_to_show = localStorage.getItem("posts_to_show");
            var current_page = localStorage.getItem("current_page");
            current_page = parseInt(current_page, 10);
            event.preventDefault();
            if (event.target.id === "next-page") {
                page_number = current_page + 1;
                show_posts(username, posts_to_show, page_number);
            } else if (event.target.id === "previous-page") {
                page_number = current_page - 1;
                show_posts(username, posts_to_show, page_number);
            }
        }
    }

    function handleLikeButtonClick(event) {
        if (event.target.classList.contains("like-link")) {
            const div_element = event.target.parentNode.parentNode.parentNode;
            const post_id = div_element.getAttribute("data-post-id");
            fetch(`like/${post_id}`, {
                method: "PUT"
            })
                .then(response => response.json())
                .then((data) => {
                    const total_likes_div = div_element.querySelector(".total-likes");
                    total_likes_div.innerHTML = `| ${data.likes} user(s) liked this post!`;
                    const like_link = div_element.querySelector(".like-link");
                    if (like_link.textContent === "Like") {
                        like_link.textContent = "Unlike";
                    } else {
                        like_link.textContent = "Like";
                    }
                });
        }
    }

    function handleEditLinkClick(event) {
        if (event.target.classList.contains("edit-link")) {
            const div_element = event.target.parentNode;
            const edit_form = document.createElement("form");
            edit_form.classList.add("m-2"); // Bootstrap margin
            const textarea = document.createElement("textarea");

            textarea.setAttribute("name", "edited-content");
            textarea.setAttribute("rows", "4");
            textarea.setAttribute("cols", "50");

            const saveButton = document.createElement("input");
            saveButton.setAttribute("type", "button");
            saveButton.setAttribute("value", "Save");
            saveButton.classList.add("btn", "save-edit", "btn-primary", "m-1");

            const cancelButton = document.createElement("input");
            cancelButton.setAttribute("type", "button");
            cancelButton.setAttribute("value", "Cancel");
            cancelButton.classList.add("btn", "cancel-edit", "btn-secondary", "m-1");


            edit_form.appendChild(textarea);
            edit_form.appendChild(saveButton);
            edit_form.appendChild(cancelButton);
            div_element.appendChild(edit_form);
        }
    }


    function handleNewPostFormSubmit(event) {
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
        this.reset();
    }

})