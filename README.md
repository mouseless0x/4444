# Uniswap V4 Vanity Miner

This repo contains three components to mine for the Uniswap V4 address:
- Modified version of [create2crunch](https://github.com/0age/create2crunch)
- Server instance to collect logs and forward salts to tg
- Script to bid on vastai instances

# Running

## Log Aggregator

This service will collect logs from all your vastai boxes. It will only forward the highest salt to tg.

### Usage

1. Setup a tg bot using [botfather](t.me/botfather) + tg channel

2. Host server using railway
```bash
cd log-aggregator
railway init
railway up
```
> You will need to supply the env vars `BOT_TOKEN` and `CHANNEL_ID` on your railway dashboard ([how to get your CHANNEL_ID](https://stackoverflow.com/questions/33858927/how-to-obtain-the-chat-id-of-a-private-telegram-channel))


## Modified create2crunch

Modified create2crunch that scores addresses based on [Uniswap's challenge criteria](https://github.com/Uniswap/v4-periphery/blob/3f295d8435e4f776ea2daeb96ce1bc6d63f33fc7/src/libraries/VanityAddressLib.sol#L16-L22). I one shotted a prompt, it looked good, and is most likely not the optimal approach.

### Usage

#### Creating template on vastai

Head to [cloud.vast.ai/templates/edit](https://cloud.vast.ai/templates/edit). You can use the docker image [`mousless/fourfourfourfour`](https://hub.docker.com/repository/docker/mousless/fourfourfourfour/general) to skip building it yourself.

Fill in the `on-startup Script` section with the following
```bash
for i in $(seq 0 $(($(clinfo | awk '/Platform Name/ {pname=$3} /Number of devices/ {if (pname ~ /NVIDIA/) {print $4}}') - 1))); do
  nohup /home/target/release/fourfourfourfour \
  0x48E516B34A1274f49457b9C6182097796D0498Cb \
  0x0000000000000000000000000000000000000000 \
  0x94d114296a5af85c1fd2dc039cdaa32f1ed4b0fe0868f02d888bfc91feb645d9 \
  $i \
  $YOUR_RAILWAY_ENDPOINT_URL_HERE \
  > "log_$i.txt" 2>&1 &
done
```
> Note: the zero address is being used in the salt meaning there is no frontrunning protection

> Note: replace `$YOUR_RAILWAY_ENDPOINT_URL_HERE` with your log-aggregator's endpoint

## GPU Bidder

vastai offers interruptable biddable boxes at a much lower price compared to renting. This is a simple script to periodically place bids on RTX 4090s (up to $0.2/h).

### Usage
```bash
cd bidder
railway init
railway up
```
> You will need to supply the env vars `VAST_API_KEY` and `VAST_TEMPLATE_HASH` on your railway dashboard.
