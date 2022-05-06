const postsList = document.querySelectorAll('.post');
const postsContainer = document.querySelector('.container');

const defaultObserverHandler = (entries) => {
  entries.forEach(entry => {
    entry.target.classList.toggle('show', entry.isIntersecting);

    if (entry.isIntersecting) {
      defaultObserver.unobserve(entry.target);
    }
  });
};

const options = { threshold: 0.3 };

const defaultObserver = new IntersectionObserver(
  defaultObserverHandler,
  options,
);

const getPosts = async (url) => {
  return (await fetch(url)).json();
};

const createPost = (title, body) => {
  const postElement = document.createElement('div');
  const postTitleElement = document.createElement('div');
  const postBodyElement = document.createElement('div');

  postTitleElement.textContent = title;
  postTitleElement.className = 'post-title';
  postBodyElement.textContent = body;
  postBodyElement.className = 'post-body';

  postElement.classList.add('post');
  postElement.append(postTitleElement);
  postElement.append(postBodyElement);

  return postElement;
}

const lastPostObserver = new IntersectionObserver(async (entries) => {
  const lastPost = entries[0];

  if (lastPost.isIntersecting) {

    const url = 'https://jsonplaceholder.typicode.com/posts?userId=1';
    const posts = await getPosts(url);

    posts.forEach(post => {
      const postElement = createPost(post.title, post.body)
      defaultObserver.observe(postElement);
      postsContainer.append(postElement);
    });

    lastPostObserver.unobserve(lastPost.target);
    lastPostObserver.observe(document.querySelector('.post:last-child'));
  }
});

postsList.forEach(post => defaultObserver.observe(post));
lastPostObserver.observe(document.querySelector('.post:last-child'));