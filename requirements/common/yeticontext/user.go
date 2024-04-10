package yeticontext

import (
	"context"

	"github.com/gin-gonic/gin"
)

const userNameContextKey = "username"

func GetUserName(ctx context.Context) string {
	v := ctx.Value(userNameContextKey)
	if v == nil {
		return ""
	}
	if userName, ok := v.(string); ok {
		return userName
	}
	return ""
}

func SetUserName(ctx *gin.Context, userName string) {
	ctx.Set(userNameContextKey, userName)
}

func DeleteUsernameFromContext(ctx *gin.Context) {
	ctx.Set(userNameContextKey, nil)
	for key := range ctx.Keys {
		if key == userNameContextKey {
			delete(ctx.Keys, key)
		}
	}
	
}