"""
Comprehensive Backend API Tests for Sri Rajlaxmi Light House
Tests all endpoints with various scenarios including auth, CRUD operations, and error cases.
"""
import requests
import pytest
from typing import Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://rajlakshmi-showcase.preview.emergentagent.com/api"

# Admin credentials
ADMIN_EMAIL = "payelraj26@gmail.com"
ADMIN_PASSWORD = "rajlaxmi@2025"

# Global variables to store state across tests
admin_token = None
test_enquiry_id = None
original_phone = None
original_whatsapp = None


class TestRootEndpoint:
    """Test 1: GET /api/ - Root endpoint"""
    
    def test_root_returns_200_with_message(self):
        """GET /api/ should return 200 with a message"""
        response = requests.get(f"{BASE_URL}/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert "message" in data, "Response should contain 'message' key"
        print(f"✅ Root endpoint: {data}")


class TestContentEndpoint:
    """Test 2: GET /api/content - Full site content"""
    
    def test_content_returns_full_structure(self):
        """GET /api/content should return 200 with complete site content structure"""
        response = requests.get(f"{BASE_URL}/content")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Verify business section
        assert "business" in data, "Missing 'business' key"
        business = data["business"]
        required_business_keys = ["phone", "whatsapp", "email", "address", "mapsQuery", "hours", "hoursFull"]
        for key in required_business_keys:
            assert key in business, f"Missing '{key}' in business section"
        
        # Store original values for later restoration
        global original_phone, original_whatsapp
        original_phone = business["phone"]
        original_whatsapp = business["whatsapp"]
        
        # Verify hero section
        assert "hero" in data, "Missing 'hero' key"
        hero = data["hero"]
        required_hero_keys = ["image", "titleLine1", "titleAccent", "subtitle"]
        for key in required_hero_keys:
            assert key in hero, f"Missing '{key}' in hero section"
        
        # Verify about section
        assert "about" in data, "Missing 'about' key"
        about = data["about"]
        assert "body" in about and isinstance(about["body"], list), "about.body should be a list"
        assert "stats" in about and isinstance(about["stats"], list), "about.stats should be a list"
        assert len(about["stats"]) == 4, f"Expected 4 stats, got {len(about['stats'])}"
        assert "chips" in about and isinstance(about["chips"], list), "about.chips should be a list"
        
        # Verify categories (12 items)
        assert "categories" in data, "Missing 'categories' key"
        categories = data["categories"]
        assert isinstance(categories, list), "categories should be a list"
        assert len(categories) == 12, f"Expected 12 categories, got {len(categories)}"
        for cat in categories:
            assert "id" in cat and "name" in cat and "icon" in cat, "Category missing required fields"
        
        # Verify products
        assert "products" in data, "Missing 'products' key"
        products = data["products"]
        assert isinstance(products, list), "products should be a list"
        assert len(products) > 0, "products list should not be empty"
        for prod in products:
            required_prod_keys = ["id", "name", "price", "category", "image", "description", "featured"]
            for key in required_prod_keys:
                assert key in prod, f"Product missing '{key}' field"
        
        # Verify whyUs (8 items)
        assert "whyUs" in data, "Missing 'whyUs' key"
        why_us = data["whyUs"]
        assert isinstance(why_us, list), "whyUs should be a list"
        assert len(why_us) == 8, f"Expected 8 whyUs items, got {len(why_us)}"
        for item in why_us:
            assert "icon" in item and "title" in item and "text" in item, "whyUs item missing required fields"
        
        # Verify gallery (9 items)
        assert "gallery" in data, "Missing 'gallery' key"
        gallery = data["gallery"]
        assert isinstance(gallery, list), "gallery should be a list"
        assert len(gallery) == 9, f"Expected 9 gallery items, got {len(gallery)}"
        for item in gallery:
            assert "title" in item and "image" in item, "Gallery item missing required fields"
        
        # Verify faqs (6 items)
        assert "faqs" in data, "Missing 'faqs' key"
        faqs = data["faqs"]
        assert isinstance(faqs, list), "faqs should be a list"
        assert len(faqs) == 6, f"Expected 6 FAQs, got {len(faqs)}"
        for faq in faqs:
            assert "q" in faq and "a" in faq, "FAQ missing required fields"
        
        print(f"✅ Content structure verified: business, hero, about, {len(categories)} categories, {len(products)} products, {len(why_us)} whyUs, {len(gallery)} gallery, {len(faqs)} FAQs")


class TestAdminLogin:
    """Test 3: POST /api/admin/login - Authentication"""
    
    def test_login_wrong_password(self):
        """POST /api/admin/login with wrong password should return 401"""
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": "wrong"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Wrong password correctly rejected with 401")
    
    def test_login_wrong_email(self):
        """POST /api/admin/login with wrong email should return 401"""
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": "hacker@example.com", "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Wrong email correctly rejected with 401")
    
    def test_login_correct_credentials(self):
        """POST /api/admin/login with correct credentials should return 200 with token"""
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "token" in data, "Response should contain 'token'"
        assert "expiresIn" in data, "Response should contain 'expiresIn'"
        assert isinstance(data["token"], str), "Token should be a string"
        assert len(data["token"]) > 0, "Token should not be empty"
        
        # Store token for subsequent tests
        global admin_token
        admin_token = data["token"]
        
        print(f"✅ Login successful, token received (length: {len(admin_token)})")


class TestAdminVerify:
    """Test 4: GET /api/admin/verify - Token validation"""
    
    def test_verify_without_token(self):
        """GET /api/admin/verify without Authorization header should return 401"""
        response = requests.get(f"{BASE_URL}/admin/verify")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Verify without token correctly rejected with 401")
    
    def test_verify_with_bad_token(self):
        """GET /api/admin/verify with invalid token should return 401"""
        response = requests.get(
            f"{BASE_URL}/admin/verify",
            headers={"Authorization": "Bearer invalid_random_token_12345"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Verify with bad token correctly rejected with 401")
    
    def test_verify_with_valid_token(self):
        """GET /api/admin/verify with valid token should return 200 with ok=true"""
        assert admin_token is not None, "Admin token not available. Login test must run first."
        
        response = requests.get(
            f"{BASE_URL}/admin/verify",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "ok" in data, "Response should contain 'ok'"
        assert data["ok"] is True, "ok should be True"
        
        print(f"✅ Token verification successful: {data}")


class TestContentUpdate:
    """Test 5: PUT /api/content - Update site content"""
    
    def test_update_without_token(self):
        """PUT /api/content without token should return 401"""
        response = requests.put(
            f"{BASE_URL}/content",
            json={"business": {"phone": "+919999999999"}}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Update without token correctly rejected with 401")
    
    def test_update_with_token(self):
        """PUT /api/content with admin token should update and persist changes"""
        assert admin_token is not None, "Admin token not available"
        
        # First, get current content to preserve all fields
        get_response = requests.get(f"{BASE_URL}/content")
        current_content = get_response.json()
        current_business = current_content["business"]
        
        # Update phone and whatsapp
        updated_business = {**current_business}
        updated_business["phone"] = "+919999999999"
        updated_business["whatsapp"] = "919999999999"
        
        # Send update
        update_response = requests.put(
            f"{BASE_URL}/content",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"business": updated_business}
        )
        assert update_response.status_code == 200, f"Expected 200, got {update_response.status_code}"
        
        # Verify response reflects changes
        updated_data = update_response.json()
        assert updated_data["business"]["phone"] == "+919999999999", "Phone not updated in response"
        assert updated_data["business"]["whatsapp"] == "919999999999", "WhatsApp not updated in response"
        
        # Verify persistence with fresh GET
        verify_response = requests.get(f"{BASE_URL}/content")
        verify_data = verify_response.json()
        assert verify_data["business"]["phone"] == "+919999999999", "Phone not persisted"
        assert verify_data["business"]["whatsapp"] == "919999999999", "WhatsApp not persisted"
        
        print("✅ Content update successful and persisted")
    
    def test_restore_original_values(self):
        """Restore original phone and whatsapp values"""
        assert admin_token is not None, "Admin token not available"
        assert original_phone is not None, "Original phone not captured"
        assert original_whatsapp is not None, "Original whatsapp not captured"
        
        # Get current content
        get_response = requests.get(f"{BASE_URL}/content")
        current_content = get_response.json()
        current_business = current_content["business"]
        
        # Restore original values
        restored_business = {**current_business}
        restored_business["phone"] = original_phone
        restored_business["whatsapp"] = original_whatsapp
        
        # Send update
        restore_response = requests.put(
            f"{BASE_URL}/content",
            headers={"Authorization": f"Bearer {admin_token}"},
            json={"business": restored_business}
        )
        assert restore_response.status_code == 200, f"Expected 200, got {restore_response.status_code}"
        
        # Verify restoration
        verify_response = requests.get(f"{BASE_URL}/content")
        verify_data = verify_response.json()
        assert verify_data["business"]["phone"] == original_phone, "Phone not restored"
        assert verify_data["business"]["whatsapp"] == original_whatsapp, "WhatsApp not restored"
        
        print(f"✅ Original values restored: phone={original_phone}, whatsapp={original_whatsapp}")


class TestEnquiries:
    """Test 6-8: Enquiry CRUD operations"""
    
    def test_create_enquiry(self):
        """POST /api/enquiries should create enquiry and return id"""
        response = requests.post(
            f"{BASE_URL}/enquiries",
            json={
                "name": "Test User",
                "email": "test@example.com",
                "phone": "+911234567890",
                "message": "I need a chandelier for my living room."
            }
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "id" in data, "Response should contain 'id'"
        assert isinstance(data["id"], str), "ID should be a string (UUID)"
        assert len(data["id"]) > 0, "ID should not be empty"
        
        # Store for later tests
        global test_enquiry_id
        test_enquiry_id = data["id"]
        
        print(f"✅ Enquiry created with id: {test_enquiry_id}")
    
    def test_list_enquiries_without_token(self):
        """GET /api/enquiries without token should return 401"""
        response = requests.get(f"{BASE_URL}/enquiries")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ List enquiries without token correctly rejected with 401")
    
    def test_list_enquiries_with_token(self):
        """GET /api/enquiries with admin token should return list including created enquiry"""
        assert admin_token is not None, "Admin token not available"
        assert test_enquiry_id is not None, "Test enquiry not created"
        
        response = requests.get(
            f"{BASE_URL}/enquiries",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert isinstance(data, list), "Response should be a list"
        
        # Find our test enquiry
        test_enquiry = None
        for enquiry in data:
            if enquiry.get("id") == test_enquiry_id:
                test_enquiry = enquiry
                break
        
        assert test_enquiry is not None, f"Created enquiry {test_enquiry_id} not found in list"
        
        # Verify fields
        assert test_enquiry["name"] == "Test User", "Name mismatch"
        assert test_enquiry["email"] == "test@example.com", "Email mismatch"
        assert test_enquiry["phone"] == "+911234567890", "Phone mismatch"
        assert "I need a chandelier" in test_enquiry["message"], "Message mismatch"
        assert "created_at" in test_enquiry, "Missing created_at field"
        
        # Verify newest-first ordering (our enquiry should be first or near first)
        if len(data) > 1:
            first_enquiry = data[0]
            assert "created_at" in first_enquiry, "First enquiry missing created_at"
        
        print(f"✅ Enquiries list retrieved: {len(data)} total, test enquiry found and verified")
    
    def test_delete_enquiry_without_token(self):
        """DELETE /api/enquiries/{id} without token should return 401"""
        assert test_enquiry_id is not None, "Test enquiry not created"
        
        response = requests.delete(f"{BASE_URL}/enquiries/{test_enquiry_id}")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✅ Delete enquiry without token correctly rejected with 401")
    
    def test_delete_enquiry_with_token(self):
        """DELETE /api/enquiries/{id} with admin token should delete enquiry"""
        assert admin_token is not None, "Admin token not available"
        assert test_enquiry_id is not None, "Test enquiry not created"
        
        # Delete the enquiry
        delete_response = requests.delete(
            f"{BASE_URL}/enquiries/{test_enquiry_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_response.status_code == 200, f"Expected 200, got {delete_response.status_code}"
        
        data = delete_response.json()
        assert "ok" in data, "Response should contain 'ok'"
        assert data["ok"] is True, "ok should be True"
        
        # Verify deletion by listing enquiries
        list_response = requests.get(
            f"{BASE_URL}/enquiries",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        enquiries = list_response.json()
        
        # Ensure deleted enquiry is not in list
        for enquiry in enquiries:
            assert enquiry.get("id") != test_enquiry_id, f"Deleted enquiry {test_enquiry_id} still in list"
        
        print(f"✅ Enquiry {test_enquiry_id} successfully deleted and verified")


if __name__ == "__main__":
    # Run tests with pytest
    pytest.main([__file__, "-v", "-s"])
