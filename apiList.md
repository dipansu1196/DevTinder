#DevTinder APIs
##authRouter
-POST/signup
-POST/login
-POST/logout

##profileRouter
-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password

##connectionRequestRouter
-POST/ request/send/interested/:userId
-POST/request/send/ignored/:userId
-POST/request/review/accepted/:requestId
-POST/request/review/rejected/:requestId


-GET/user/connections
-GET/requests/reveived
-GET/feed- Gets you the profiles of other user on platform


Status: ignore,interesetd,accepted,rejected