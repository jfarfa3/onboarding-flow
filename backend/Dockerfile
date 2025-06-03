FROM python:3.9
RUN pip install --upgrade pip
WORKDIR /src
COPY ./requirements.txt /src/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /src/requirements.txt
COPY ./app /src/app
CMD ["fastapi", "run", "app/main.py", "--port", "80"]