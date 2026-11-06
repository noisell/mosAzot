FROM python:3.12

LABEL authors="mirry-code-azot"

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN chmod a+x ./*.sh
