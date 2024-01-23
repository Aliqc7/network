document.addEventListener("DOMContentLoaded", function() {

    const all_posts_div = document.querySelector("#all-posts")
    const new_post_form = document.querySelector("#new-post");
    new_post_form.style.display = "none";
    all_posts_div.style.display = "none"

    document.querySelector("#create-new-post").onclick = (event) =>{
        event.preventDefault();
        new_post_form.style.display = "block";

    }

    document.querySelector("#show-all-posts").onclick = (event) =>{
        event.preventDefault();
        all_posts_div.style.display = "block"
        fetch("/show_all_posts")
        .then(response => response.json())
        .then(posts => {
            posts.forEach((post) =>{
                const div_element = document.createElement("div");
                div_element.style.border = '1px solid black'
                div_element.style.margin = '2px'
                div_element.style.textAlign = 'center'
                div_element.innerHTML = `User: ${post.user} ---- Content: /
                ${post.text}, ---- Time: ${post.timestamp} --- Likes : 0 `;
                all_posts_div.append(div_element)
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