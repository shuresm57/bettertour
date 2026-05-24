# Middleware

## requireAuth

This is a middleware, which also utilizes the token, to check if a user is authorized to access protected routes. We cab drop it as a 2nd argument into a GET or POST method, that should require login.

1. It reads the `httpOnly` token that is set from the `api/login` endpoint.
2. Verfies the signature with `JWT_SECRET`, returns a 401 if it could not verify
3. On success, it attaches the decoded payload

Implementation example:

```javascript
router.get('/api/home', requireAuth, (req, res) => { ... });
```

## Rate Limiting

Rate limiting is used to limit repeated requests for endpoints. We use two rate limiters in this project, one for the whole website, and then one that is set specifically up for authorization.

We use a rate limiter, because we want to prevent abuse and ensure a fair and stable use of resources to our users.

The general limiter:

```javascript
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
```

Authorization limiter:

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false
});
```

The key difference here being the `limit:` - in the general we set it to 100 and for the authorization it is set to 10, to drastically limit the amount of requests that can be made.