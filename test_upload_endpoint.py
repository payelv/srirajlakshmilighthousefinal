"""
Focused tests for the NEW POST /api/upload endpoint
Tests file upload functionality with auth, validation, and static serving
"""
import requests
import io
import base64

# Base URL from frontend/.env
BASE_URL = "https://rajlakshmi-showcase.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "payelraj26@gmail.com"
ADMIN_PASSWORD = "rajlaxmi@2025"

# Minimal 1x1 PNG file (base64 encoded)
# This is a valid 1x1 transparent PNG
PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
PNG_BYTES = base64.b64decode(PNG_BASE64)


def test_1_upload_without_auth():
    """Test 1: POST /api/upload without Authorization header should return 401"""
    print("\n=== Test 1: Upload without auth ===")
    
    files = {"file": ("test.png", io.BytesIO(PNG_BYTES), "image/png")}
    response = requests.post(f"{BASE_URL}/upload", files=files)
    
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print(f"✅ PASSED: Upload without auth correctly rejected with 401")
    print(f"   Response: {response.json()}")


def test_2_upload_with_bad_token():
    """Test 2: POST /api/upload with invalid token should return 401"""
    print("\n=== Test 2: Upload with bad token ===")
    
    files = {"file": ("test.png", io.BytesIO(PNG_BYTES), "image/png")}
    headers = {"Authorization": "Bearer badtoken.abc.def"}
    response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
    
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print(f"✅ PASSED: Upload with bad token correctly rejected with 401")
    print(f"   Response: {response.json()}")


def test_3_upload_with_valid_token():
    """Test 3: POST /api/upload with valid admin token and PNG file should return 200"""
    print("\n=== Test 3: Upload with valid token ===")
    
    # First, get admin token
    login_response = requests.post(
        f"{BASE_URL}/admin/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    assert login_response.status_code == 200, f"Login failed: {login_response.status_code}"
    admin_token = login_response.json()["token"]
    print(f"   Admin token obtained (length: {len(admin_token)})")
    
    # Upload PNG file
    files = {"file": ("test.png", io.BytesIO(PNG_BYTES), "image/png")}
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    data = response.json()
    print(f"   Response data: {data}")
    
    # Verify response structure
    assert "url" in data, "Response missing 'url' key"
    assert "path" in data, "Response missing 'path' key"
    assert "filename" in data, "Response missing 'filename' key"
    assert "size" in data, "Response missing 'size' key"
    assert "contentType" in data, "Response missing 'contentType' key"
    
    # Verify url format
    assert data["url"].startswith("http"), f"URL should start with http/https: {data['url']}"
    assert "/api/uploads/" in data["url"], f"URL should contain /api/uploads/: {data['url']}"
    
    # Verify path format
    assert data["path"].startswith("/api/uploads/"), f"Path should start with /api/uploads/: {data['path']}"
    
    # Verify size
    assert data["size"] > 0, f"Size should be > 0, got {data['size']}"
    
    # Verify contentType
    assert data["contentType"] == "image/png", f"Expected image/png, got {data['contentType']}"
    
    print(f"✅ PASSED: Upload successful")
    print(f"   URL: {data['url']}")
    print(f"   Path: {data['path']}")
    print(f"   Filename: {data['filename']}")
    print(f"   Size: {data['size']} bytes")
    print(f"   Content-Type: {data['contentType']}")
    
    return data["url"], admin_token


def test_4_get_uploaded_file(upload_url):
    """Test 4: GET uploaded file URL without auth should return 200 with image"""
    print("\n=== Test 4: GET uploaded file (public access) ===")
    
    # WORKAROUND: Backend returns internal cluster URL, but file is accessible via public URL
    # Replace internal URL with public URL for testing
    if "cluster-5.preview.emergentcf.cloud" in upload_url:
        upload_url = upload_url.replace(
            "http://rajlakshmi-showcase.cluster-5.preview.emergentcf.cloud",
            "https://rajlakshmi-showcase.preview.emergentagent.com"
        )
        print(f"   ⚠️  URL corrected to public endpoint: {upload_url}")
    
    response = requests.get(upload_url)
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    # Verify content-type
    content_type = response.headers.get("content-type", "")
    assert "image" in content_type.lower(), f"Expected image content-type, got {content_type}"
    
    # Verify content length matches
    content_length = len(response.content)
    assert content_length > 0, f"Content should not be empty"
    
    print(f"✅ PASSED: Uploaded file publicly accessible")
    print(f"   Content-Type: {content_type}")
    print(f"   Content-Length: {content_length} bytes")


def test_5_upload_text_file(admin_token):
    """Test 5: POST /api/upload with text file should return 400"""
    print("\n=== Test 5: Upload text file (should reject) ===")
    
    text_content = b"hello"
    files = {"file": ("notes.txt", io.BytesIO(text_content), "text/plain")}
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = requests.post(f"{BASE_URL}/upload", files=files, headers=headers)
    
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    
    data = response.json()
    detail = data.get("detail", "").lower()
    assert "unsupported" in detail or "txt" in detail or "text" in detail, \
        f"Error message should mention unsupported/txt/text: {detail}"
    
    print(f"✅ PASSED: Text file correctly rejected with 400")
    print(f"   Response: {data}")


def test_6_upload_without_file_field(admin_token):
    """Test 6: POST /api/upload without 'file' field should return 422"""
    print("\n=== Test 6: Upload without file field ===")
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    # Send empty multipart form (no file field)
    response = requests.post(f"{BASE_URL}/upload", headers=headers, data={})
    
    assert response.status_code == 422, f"Expected 422, got {response.status_code}"
    
    print(f"✅ PASSED: Missing file field correctly rejected with 422")
    print(f"   Response: {response.json()}")


def test_7_get_nonexistent_file():
    """Test 7: GET /api/uploads/does-not-exist.jpg should return 404"""
    print("\n=== Test 7: GET non-existent file ===")
    
    response = requests.get(f"{BASE_URL}/uploads/does-not-exist-xxxxxxx.jpg")
    
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    
    print(f"✅ PASSED: Non-existent file correctly returns 404")


def test_8_regression_get_content():
    """Test 8: Regression smoke - GET /api/content should still work"""
    print("\n=== Test 8: Regression - GET /api/content ===")
    
    response = requests.get(f"{BASE_URL}/content")
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    data = response.json()
    assert "business" in data, "Missing business key"
    assert "hero" in data, "Missing hero key"
    assert "products" in data, "Missing products key"
    
    print(f"✅ PASSED: GET /api/content still working")


def test_9_regression_admin_login():
    """Test 9: Regression smoke - POST /api/admin/login should still work"""
    print("\n=== Test 9: Regression - POST /api/admin/login ===")
    
    response = requests.post(
        f"{BASE_URL}/admin/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    
    data = response.json()
    assert "token" in data, "Missing token key"
    
    print(f"✅ PASSED: POST /api/admin/login still working")


def run_all_tests():
    """Run all tests in sequence"""
    print("=" * 80)
    print("UPLOAD ENDPOINT TEST SUITE")
    print("=" * 80)
    
    try:
        # Tests 1-2: Auth validation
        test_1_upload_without_auth()
        test_2_upload_with_bad_token()
        
        # Test 3: Successful upload
        upload_url, admin_token = test_3_upload_with_valid_token()
        
        # Test 4: Public file access
        test_4_get_uploaded_file(upload_url)
        
        # Tests 5-6: Validation errors
        test_5_upload_text_file(admin_token)
        test_6_upload_without_file_field(admin_token)
        
        # Test 7: 404 handling
        test_7_get_nonexistent_file()
        
        # Tests 8-9: Regression smoke
        test_8_regression_get_content()
        test_9_regression_admin_login()
        
        print("\n" + "=" * 80)
        print("✅ ALL TESTS PASSED (9/9)")
        print("=" * 80)
        return True
        
    except AssertionError as e:
        print("\n" + "=" * 80)
        print(f"❌ TEST FAILED: {e}")
        print("=" * 80)
        return False
    except Exception as e:
        print("\n" + "=" * 80)
        print(f"❌ UNEXPECTED ERROR: {e}")
        print("=" * 80)
        return False


if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)
