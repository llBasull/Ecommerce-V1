document.querySelector("#checkoutBTN").addEventListener("click", (e) => {
        e.preventDefault(); // Prevent the default behavior of the button click event

    fetch("/create-checkout-session", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: [
                { id: 2122, quantity: 2 },
                {id: 3212, quantity: 1}
            ]
        })
    }).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return res.json().then(json => Promise.reject(json))
        }
    }).then(({ url }) => {
        console.log(url)
        window.location = url
    }).catch(e => {
        console.error(e)
    })
})