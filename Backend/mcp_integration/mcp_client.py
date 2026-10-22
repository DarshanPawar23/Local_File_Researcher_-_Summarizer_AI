
import sys
import asyncio
from pathlib import Path

from langchain_mcp_adapters.client import MultiServerMCPClient

BASE_DIR = Path(__file__).resolve().parent.parent
MCP_SERVER_PATH = BASE_DIR / "mcp_integration" / "mcp_server.py"

if not MCP_SERVER_PATH.is_file():
    raise FileNotFoundError(
        f"MCP server not found: {MCP_SERVER_PATH}"
    )

mcp_client = MultiServerMCPClient(
    {
        "local_file_researcher": {

            "command": sys.executable,

            "args": [str(MCP_SERVER_PATH)],

            "transport": "stdio",
        }
    }
)


async def get_mcp_tools():
    """
    Connect to the MCP server and retrieve its tools.

    The adapter converts the MCP tool definitions into
    LangChain-compatible tools.
    """

    tools = await mcp_client.get_tools()

    return tools


async def main():
    tools = await get_mcp_tools()

    print("Available MCP tools:")

    for tool in tools:
        print(f"Name: {tool.name}")
        print(f"Description: {tool.description}")


if __name__ == "__main__":
    asyncio.run(main())
