document.addEventListener("DOMContentLoaded", function() {

    const all_posts_div = document.querySelector("#all-posts")
    const new_post_form = document.querySelector("#new-post");
    new_post_form.style.display = "none";
    all_posts_div.style.display = "none"

    document.querySelector("#create-new-post").onclick = (event) =>{
        event.preventDefault();
        new_post_form.style.display = "block";

    }

    all_posts_div.addEventListener("click", function(event) {
        if (event.target.classList.contains("user-profile")) {
            event.preventDefault();
            console.log(event.target);
            alert("link clicked");
            console.log("hi");
        }
    });


    document.querySelector("#show-all-posts").onclick = (event) =>{
        event.preventDefault();
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
    }

})