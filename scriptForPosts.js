(() => {
	const db = firebase.database();
	const tweetsDB = db.ref('/tweets');
	const postContainer = document.getElementById('post-container');
	const newPost = document.getElementById('new-post');
	const post = data => {
		const state = data.val();
		document.getElementById('new-post-text').value = ' ';
		return `<figure class="profile-avatar post-section-avatar">
              <img src="index.jpg" alt="BP" class="profile-image">
          </figure>
          <div class="post-content">
              <div class="post-author">
                  <h3 class="post-author-name">${state.username}</h3>
                  <span class="post-delimiter fa fa-circle"></span>
                  <span class="post-date">${time_ago(new Date(state.date))}</span>
              </div>
              <p class="post-text">${state.message}</p>
              <div class="post-footer">
                  <div class="post-reaction">
                      <button class="fa fa-thumbs-up like-btn" data-id="${data.key}"></button>
                      <span class="post-likes">${state.likes}</span>
                  </div>

                  <div class="post-reaction dislike-container">
                      <button class="fa fa-thumbs-down dislike-btn" data-id="${data.key}"></button>
                      <span class="post-dislikes">${state.dislikes}</span>
				  </div>

				  <div class="post-reaction heart-container">
                      <button class="fa fa-heart heart-btn" data-id="${data.key}"></button>
                      <span class="post-hearts">${state.hearts}</span>
				  </div>

				  <div class="post-reaction bug-container">
				  <button class="fa fa-bug bug-btn" data-id="${data.key}"></button>
				  <span class="post-bugs">${state.bugs}</span>
			  </div>
              </div>
          </div>
          <div class="post-close">
              <button class="post-close fa fa-times" data-id="${data.key}"></button>
          </div>`;
	};
	const postTweet = (message) => {
		const newMessage = document.getElementById("new-post-text").value;
		const currentUser = firebase.auth().currentUser;
		const userDisplayName = currentUser ? currentUser.displayName : "";
		const userId = currentUser ? currentUser.uid : "";
		const date = new Date().toString();
		const likes = 0;
		const dislikes = 0;
		const hearts=0;
		const bugs=0;
		const db = firebase.database();
		const tweetDbRef = db.ref('tweets/');
		const userDbRef = currentUser ? db.ref('users/' + userId) : undefined;

		tweetDbRef.push({
			'username': userDisplayName,
			'userId': userId,
			'date': date,
			'likes': likes,
			'dislikes': dislikes,
			'hearts': hearts,
			'bugs':bugs,
			'message': newMessage
		});
		if (userDbRef) {

			userDbRef.once('value').then(snapshot => {
				if (snapshot.val()) {
					let tweets = parseInt(snapshot.val()['tweets']) + 1;

					// increment count of posts for current user
					userDbRef.update({
						tweets: tweets
					});
				} else {

					userDbRef.set({
						'likes': '0',
						'tweets': '1'
					});
				}
			});
		}
	};
	newPost.addEventListener('submit', event => {
		event.preventDefault();
		postTweet(event);
		
	});

	tweetsDB.on('child_added', data => {
		document.getElementById("loader").classList.add("hidden");
		let div = document.createElement('DIV');
		div.classList.add('post');
		div.innerHTML = post(data);
		postContainer.prepend(div);

		div.querySelector('.like-btn').addEventListener('click', event => {
			event.preventDefault();
			tweet.incrementLikes(event.target.getAttribute('data-id'));
		});

		div.querySelector('.dislike-btn').addEventListener('click', event => {
			event.preventDefault();
			tweet.incrementDislikes(event.target.getAttribute('data-id'));
		});

		div.querySelector('.heart-btn').addEventListener('click', event => {
			event.preventDefault();
			tweet.incrementHearts(event.target.getAttribute('data-id'));
		});

		
		div.querySelector('.bug-btn').addEventListener('click', event => {
			event.preventDefault();
			tweet.incrementBugs(event.target.getAttribute('data-id'));
		});

		div.querySelector('.post-close').addEventListener('click', event => {
			event.preventDefault();
			const postId = event.target.getAttribute('data-id');
			tweet.delete(postId);
			document.getElementById('post-container').removeChild(event.target.parentNode.parentNode);
		})
	});

	tweetsDB.on('child_changed', data => {
		if (!validateUser()) {
			return;
		}

		document.querySelector(`.like-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().likes;
		document.querySelector(`.dislike-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().dislikes;
		document.querySelector(`.heart-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().hearts;
		document.querySelector(`.bug-btn[data-id=${data.key}]`).nextElementSibling.innerText = data.val().bugs;
	});

	function validateUser() {
		if (!firebase.auth().currentUser) {
			// user is not logged in
			//window.location = 'index.html?error=accessDenied';
			return false;
		}

		return true;
	}
	const incrementLikes = (id) => {
		reactOnTweet(id, 'likes', 'increment');
	};

	const decrementLikes = (id) => {
		reactOnTweet(id, 'likes', 'decrement');
	};

	const incrementDislikes = (id) => {
		reactOnTweet(id, 'dislikes', 'increment');
	};

	const decrementDislikes = (id) => {
		reactOnTweet(id, 'dislikes', 'decrement');
	};

	const incrementHearts = (id) => {
		reactOnTweet(id, 'hearts', 'increment');
	};

	const decrementHearts = (id) => {
		reactOnTweet(id, 'hearts', 'decrement');
	};

	const incrementBugs = (id) => {
		reactOnTweet(id, 'bugs', 'increment');
	};

	const decrementBugs = (id) => {
		reactOnTweet(id, 'bugs', 'decrement');
	};

	const reactOnTweet = (id, reaction, operation) => {
		const db = firebase.database();
		const dbRef = db.ref('tweets/' + id);

		dbRef.once('value').then(snapshot => {
			let count = parseInt(snapshot.val()[reaction]);

			if (operation === 'increment') {
				count += 1;

				db.ref('users/' + snapshot.val()["userId"]).once('value').then(userSnapshot => {
					var likes = parseInt(userSnapshot.val()['likes']) + 1;
					db.ref('users/' + snapshot.val()["userId"]).update({
						'likes': likes
					});
					
				});
			} else {
				count -= 1;
			}

			dbRef.update({
				[reaction]: count
			});
			location.reload();
		});
	};

	const deleteTweet = id => {
		const db = firebase.database();
		const dbRef = db.ref('tweets/' + id);

		dbRef.remove();
	};

	const getUserStats = id => {
		const db = firebase.database();
		return db.ref('users/' + id);
	};

	

	function time_ago(time) {
		const time_formats = [
			[60, 'seconds', 1],
			[120, '1 minute ago', '1 minute from now'], 
			[3600, 'minutes', 60], 
			[7200, '1 hour ago', '1 hour from now'],
			[86400, 'hours', 3600],
			[172800, 'Yesterday', 'Tomorrow'], 
			[604800, 'days', 86400],
			[1209600, 'Last week', 'Next week'],
			[2419200, 'weeks', 604800],
			[4838400, 'Last month', 'Next month'],
			[29030400, 'months', 2419200], 
			[58060800, 'Last year', 'Next year'],
			[2903040000, 'years', 29030400],
			[5806080000, 'Last century', 'Next century'],
			[58060800000, 'centuries', 2903040000] 
		];
		let seconds = (+new Date() - time) / 1000,
			token = 'ago',
			list_choice = 1;

		if (seconds === 0) {
			return 'Just now'
		}
		if (seconds < 0) {
			seconds = Math.abs(seconds);
			token = 'from now';
			list_choice = 2;
		}
		let i = 0,
			format;
		while (format = time_formats[i++])
			if (seconds < format[0]) {
				if (typeof format[2] === 'string')
					return format[list_choice];
				else
					return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
			}
		return time;
	}

	this.tweet = {
		post: postTweet,
		delete: deleteTweet,
		incrementLikes: incrementLikes,
		decrementLikes: decrementLikes,
		incrementDislikes: incrementDislikes,
		decrementDislikes: decrementDislikes,
		incrementHearts:incrementHearts,
		decrementHearts:decrementHearts,
		incrementBugs:incrementBugs,
		decrementBugs:decrementBugs,
	};
	
})(); 
const logout = document.getElementById("logout-btn");
	logout.addEventListener('click',validate);
   function	validate(event)
   {
	   event.preventDefault();
	   auth.signOut().then(()=>{
		   window.location.href="homePage.html";
	   }
	   )
}