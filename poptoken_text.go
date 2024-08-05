package main

import (
	"crypto/rsa"
	"encoding/pem"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
)

// Mock private key in PEM format (unencrypted for simplicity)
const testPrivateKeyPEM = `
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA1zK5om3oxOJqHfDOQZ2RqqBO7HKZy7NiD4Vp8mF6yTj5R0Ni
...
-----END RSA PRIVATE KEY-----
`

// TestCreatePayload tests the creation of the payload for the PoP token.
func TestCreatePayload(t *testing.T) {
	claims := createPayload()

	assert.Equal(t, "example_issuer", claims.Issuer)
	assert.Contains(t, claims.Audience, "example_audience")
	assert.WithinDuration(t, time.Now().Add(time.Hour), claims.ExpiresAt.Time, time.Second)
	assert.WithinDuration(t, time.Now(), claims.IssuedAt.Time, time.Second)
	assert.Equal(t, "example_custom_value", claims.CustomField)
}

// TestGetPrivateKeyFromPEM tests the parsing of the private key from PEM format.
func TestGetPrivateKeyFromPEM(t *testing.T) {
	password := []byte("your_password")

	block, _ := pem.Decode([]byte(testPrivateKeyPEM))
	assert.NotNil(t, block)

	privateKey, err := getPrivateKeyFromPEM([]byte(testPrivateKeyPEM), password)
	assert.NoError(t, err)
	assert.IsType(t, &rsa.PrivateKey{}, privateKey)
}

// TestSignToken tests signing a PoP token using a valid private key.
func TestSignToken(t *testing.T) {
	privateKey, _ := getPrivateKeyFromPEM([]byte(testPrivateKeyPEM), []byte(""))

	claims := createPayload()
	token, err := signToken(claims, privateKey)

	assert.NoError(t, err)
	assert.NotEmpty(t, token)

	// Verify the token
	parsedToken, err := jwt.ParseWithClaims(token, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return &privateKey.PublicKey, nil
	})
	assert.NoError(t, err)
	assert.True(t, parsedToken.Valid)

	parsedClaims, ok := parsedToken.Claims.(*CustomClaims)
	assert.True(t, ok)
	assert.Equal(t, claims.CustomField, parsedClaims.CustomField)
}
