from mcp.server.fastmcp import FastMCP
import time
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    filename="mcp.log",
    filemode="a"
    )
logger = logging.getLogger(__name__)

mcp = FastMCP("add_integers")

class MCPError(Exception):
    def __init__(self, code: int, message: str):
        self.code = code
        self.message = message
        super().__init__(f"[{code}] {self.message}")

@mcp.tool()
def add_integers(a: int, b: int) -> int:
    '''
    Add two integers and return the result.
    
    Args:
        a (int): The first integer.
        b (int): The second integer.
    
    Returns:
        The sum of the two integers.
    '''
    logger.info(f"Adding {a} and {b}")
    return a + b

@mcp.tool()
def divide_integers(a: int, b: int) -> int:
    '''
    Divide two integers and return the result.

    Args:
        a (int): The first integer.
        b (int): The second integer.
    
    Returns:
        The result of the division.
    '''
    if b == 0:
        raise MCPError(code=400,message="Division by zero is not allowed.")
    return a / b


if __name__ == "__main__":
    mcp.run(transport="stdio")