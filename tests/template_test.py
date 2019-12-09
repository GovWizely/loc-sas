from tests.app_test import AppTest


class TemplateTest(AppTest):

    def test_index_template(self):
        response = self.client.get("/")
        assert response.status_code == 200
        page_content = response.data.decode("utf-8")
        assert "Copyright Application Demo" in page_content
