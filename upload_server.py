import http.server, socketserver, base64, urllib.parse, os
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'export')
class H(http.server.BaseHTTPRequestHandler):
    def cors(self):
        self.send_header('Access-Control-Allow-Origin','*')
        self.send_header('Access-Control-Allow-Methods','POST,OPTIONS')
        self.send_header('Access-Control-Allow-Headers','Content-Type')
    def do_OPTIONS(self):
        self.send_response(200); self.cors(); self.end_headers()
    def do_POST(self):
        q=urllib.parse.urlparse(self.path); ps=urllib.parse.parse_qs(q.query)
        name=ps.get('name',['x.bin'])[0].replace('..','')
        n=int(self.headers.get('Content-Length',0)); data=self.rfile.read(n)
        try: raw=base64.b64decode(data)
        except Exception as e: raw=b''
        p=os.path.join(OUT,name); os.makedirs(os.path.dirname(p),exist_ok=True)
        open(p,'wb').write(raw)
        self.send_response(200); self.cors(); self.end_headers(); self.wfile.write(b'ok')
    def log_message(self,*a): pass
socketserver.TCPServer.allow_reuse_address=True
socketserver.TCPServer(('127.0.0.1',8899),H).serve_forever()
